import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";
import { provider, resourceGroup } from "@cdktf/provider-azurerm";

export class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new provider.AzurermProvider(this, "azurerm", {
      features: [{}],
    });

    const rg = new resourceGroup.ResourceGroup(this, "rg", {
      name: "rg-baseline-environment-on-azure-cdktf-typescript",
      location: "japaneast",
    });

    new TerraformOutput(this, "rg_name", {
      value: rg.name,
    });
  }
}

const app = new App();
new MyStack(app, "baseline-environment-on-azure-cdktf-typescript");
app.synth();
