import tracer from 'dd-trace';

if (process.env.DD_API_KEY) {
  // see settings @ https://datadoghq.dev/dd-trace-js/#tracer-settings
  tracer.init({
    profiling: true,
    runtimeMetrics: true,
    env: process.env.NODE_ENV,
  });

  // eslint-disable-next-line no-console
  console.log('Datadog set up:\nenv', process.env.NODE_ENV);
}

export default tracer;
