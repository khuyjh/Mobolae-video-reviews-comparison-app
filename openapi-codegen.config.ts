import { defineConfig } from '@openapi-codegen/cli';
import { generateSchemaTypes, generateReactQueryComponents } from '@openapi-codegen/typescript';
export default defineConfig({
  query: {
    from: {
      relativePath: './api.json',
      source: 'file',
    },
    outputDir: 'queries',
    to: async (context) => {
      const filenamePrefix = 'query';
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
