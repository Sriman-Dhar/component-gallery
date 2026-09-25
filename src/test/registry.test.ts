import { COMPONENT_TYPES } from '../lib/types';
import { findEntry, metaFolders, registry } from '../lib/registry';

describe('registry', () => {
  it('includes the example-button placeholder', () => {
    expect(findEntry('example-button')?.meta.name).toBe('Example Button');
  });

  it('keys every component by a slug equal to its folder name', () => {
    for (const { meta } of registry) {
      expect(metaFolders[meta.slug]).toBe(meta.slug);
    }
  });

  it('has unique slugs and valid type labels', () => {
    const slugs = registry.map(({ meta }) => meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const { meta } of registry) {
      expect(COMPONENT_TYPES).toContain(meta.type);
    }
  });
});
