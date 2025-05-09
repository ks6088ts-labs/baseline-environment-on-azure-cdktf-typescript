import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';
import {
  provider as azureadProvider,
  dataAzureadDomains,
} from '@cdktf/provider-azuread';
import {
  provider as azurermProvider,
  dataAzurermSubscription,
  roleAssignment,
} from '@cdktf/provider-azurerm';
import { User } from '../construct/azuread/user';
import { Group } from '../construct/azuread/group';
import { GroupMember } from '../construct/azuread/group-member';
import { Application } from '../construct/azuread/application';
import { ServicePrincipal } from '../construct/azuread/service-principal';
import { createBackend } from '../utils';

export interface AzureadPlaygroundStackProps {
  user?: {
    name: string;
    password: string;
  };
  group?: {
    name: string;
    description?: string;
  };
  groupMember?: {};
  application?: {
    name: string;
  };
  servicePrincipal?: {};
}

export const devAzureadPlaygroundStackProps: AzureadPlaygroundStackProps = {
  user: {
    name: 'dev-ks6088ts',
    password: 'P@ssw0rd!',
  },
  group: {
    name: 'dev-developers',
    description: 'Developers group for dev environment',
  },
  groupMember: {},
  application: {
    name: 'dev-application-baseline-environment-cdktf-typescript',
  },
  servicePrincipal: {},
};

export const prodAzureadPlaygroundStackProps: AzureadPlaygroundStackProps = {
  user: {
    name: 'prod-ks6088ts',
    password: 'P@ssw0rd!',
  },
};

export class AzureadPlaygroundStack extends TerraformStack {
  constructor(
    scope: Construct,
    id: string,
    props: AzureadPlaygroundStackProps,
  ) {
    super(scope, id);

    // Datasources
    const domains = new dataAzureadDomains.DataAzureadDomains(this, 'domains', {
      onlyInitial: true,
    });

    // Backend
    createBackend(this, id);

    // Providers
    new azureadProvider.AzureadProvider(this, 'azuread', {});
    new azurermProvider.AzurermProvider(this, 'azurerm', {
      features: [{}],
    });

    // Resources
    let user: User | undefined = undefined;
    if (props.user) {
      user = new User(this, 'User', {
        name: props.user.name,
        userPrincipalName: `${props.user.name}@${domains.domains.get(0).domainName}`,
        password: props.user.password,
      });
    }

    let group: Group | undefined = undefined;
    if (props.group) {
      group = new Group(this, 'Group', {
        name: props.group.name,
        description: props.group.description,
      });

      const subscription = new dataAzurermSubscription.DataAzurermSubscription(
        this,
        'subscription',
        {},
      );

      new roleAssignment.RoleAssignment(this, 'role_assignment', {
        scope: subscription.id,
        roleDefinitionName: 'Contributor',
        principalId: group.group.objectId,
      });
    }

    if (props.groupMember && user && group) {
      new GroupMember(this, 'GroupMember-User', {
        groupObjectId: group.group.objectId,
        memberObjectId: user.user.objectId,
      });
    }

    let application: Application | undefined = undefined;
    if (props.application) {
      // Application
      application = new Application(this, 'Application', {
        name: props.application.name,
      });
    }

    let servicePrincipal: ServicePrincipal | undefined = undefined;
    if (props.servicePrincipal && application) {
      // Service Principal
      servicePrincipal = new ServicePrincipal(this, 'ServicePrincipal', {
        clientId: application.application.clientId,
      });
    }

    if (props.groupMember && servicePrincipal && group) {
      new GroupMember(this, 'GroupMember-ServicePrincipal', {
        groupObjectId: group.group.objectId,
        memberObjectId: servicePrincipal.servicePrincipal.objectId,
      });
    }
  }
}
