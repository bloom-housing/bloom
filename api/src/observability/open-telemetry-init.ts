// https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
import { NodeSDK } from '@opentelemetry/sdk-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
// https://aws-otel.github.io/docs/getting-started/js-sdk/metric-manual-instr
const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-grpc");

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'bloom-api',
    [ATTR_SERVICE_VERSION]: '2.0'
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
    exportIntervalMillis: 1000,
  }),
});

sdk.start();
