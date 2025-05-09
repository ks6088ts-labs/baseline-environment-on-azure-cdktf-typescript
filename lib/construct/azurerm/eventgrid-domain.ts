import { Construct } from 'constructs';
import { eventgridDomain } from '@cdktf/provider-azurerm';

interface EventgridDomainProps {
  name: string;
  location: string;
  tags?: { [key: string]: string };
  resourceGroupName: string;
  inputSchema: string;
}

export class EventgridDomain extends Construct {
  public readonly eventgridDomain: eventgridDomain.EventgridDomain;
  constructor(scope: Construct, id: string, props: EventgridDomainProps) {
    super(scope, id);

    // Resources
    this.eventgridDomain = new eventgridDomain.EventgridDomain(
      this,
      'eventgrid_domain',
      {
        name: props.name,
        location: props.location,
        tags: props.tags,
        resourceGroupName: props.resourceGroupName,
        identity: {
          type: 'SystemAssigned',
        },
        inputSchema: props.inputSchema,
      },
    );
  }
}
