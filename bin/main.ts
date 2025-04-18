#!/usr/bin/env node
import { App } from 'cdktf';
import {
  PlaygroundStack,
  devPlaygroundStackProps,
  prodPlaygroundStackProps,
} from '../lib/stack/playground-stack';
import {
  BackendStack,
  devBackendStackProps,
  prodBackendStackProps,
} from '../lib/stack/backend-stack';
import {
  AzureadStack,
  devAzureadStackProps,
  prodAzureadStackProps,
} from '../lib/stack/azuread-stack';
import {
  GithubStack,
  devGithubStackProps,
  prodGithubStackProps,
} from '../lib/stack/github-stack';
import {
  ServicePrincipalStack,
  devServicePrincipalStackProps,
  prodServicePrincipalStackProps,
} from '../lib/stack/service-principal-stack';

const app = new App();

// Development Environment
new PlaygroundStack(app, `Dev-PlaygroundStack`, devPlaygroundStackProps);
new BackendStack(app, `Dev-BackendStack`, devBackendStackProps);
new AzureadStack(app, `Dev-AzureadStack`, devAzureadStackProps);
new GithubStack(app, `Dev-GithubStack`, devGithubStackProps);
new ServicePrincipalStack(
  app,
  `Dev-ServicePrincipalStack`,
  devServicePrincipalStackProps,
);

// Production Environment
new PlaygroundStack(app, `Prod-PlaygroundStack`, prodPlaygroundStackProps);
new BackendStack(app, `Prod-BackendStack`, prodBackendStackProps);
new AzureadStack(app, `Prod-AzureadStack`, prodAzureadStackProps);
new GithubStack(app, `Prod-GithubStack`, prodGithubStackProps);
new ServicePrincipalStack(
  app,
  `Prod-ServicePrincipalStack`,
  prodServicePrincipalStackProps,
);

app.synth();
