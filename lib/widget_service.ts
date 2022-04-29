import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { CfnOutput } from "aws-cdk-lib";

export class WidgetService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, "WidgetStore", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    const handler = new lambda.Function(this, "WidgetHandler", {
      runtime: lambda.Runtime.NODEJS_14_X, // So we can use async in widget.js
      code: lambda.Code.fromAsset("resources"),
      handler: "widgets.main",
      environment: {
        BUCKET: bucket.bucketName
      }
    });

    bucket.grantReadWrite(handler); // was: handler.role);

    const url = handler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });

    new CfnOutput(this, 'URL', { value: url.url });
  }
}