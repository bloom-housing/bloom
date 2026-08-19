import {
  stampSourceHashes,
  staleFieldPaths,
} from '../../../src/utilities/content-source-hash';
import { sourceHash } from '../../../src/utilities/translation-source-hash';

const englishFaq = {
  categories: [
    {
      id: 'applying',
      title: 'Applying',
      items: [
        { id: 'how', question: 'How?', answerHtml: '<p>Apply online.</p>' },
        { id: 'when', question: 'When?', answerHtml: '<p>Any time.</p>' },
      ],
    },
  ],
};

const spanishFaq = {
  categories: [
    {
      id: 'applying',
      items: [{ id: 'how', answerHtml: '<p>Solicite en linea.</p>' }],
    },
  ],
};

describe('stampSourceHashes', () => {
  it('records the English value each translated field came from', () => {
    const stamped = stampSourceHashes(
      englishFaq,
      spanishFaq,
    ) as typeof spanishFaq;
    const item = stamped.categories[0].items[0] as Record<string, unknown>;

    expect(item._sourceHashes).toEqual({
      answerHtml: sourceHash('<p>Apply online.</p>'),
    });
  });

  it('leaves the document it was given untouched', () => {
    stampSourceHashes(englishFaq, spanishFaq);

    expect(
      (spanishFaq.categories[0].items[0] as Record<string, unknown>)
        ._sourceHashes,
    ).toBeUndefined();
  });

  it('skips a field with no English counterpart', () => {
    const stamped = stampSourceHashes(
      { categories: [{ id: 'applying', items: [{ id: 'how' }] }] },
      spanishFaq,
    ) as typeof spanishFaq;

    expect(
      (stamped.categories[0].items[0] as Record<string, unknown>)._sourceHashes,
    ).toBeUndefined();
  });

  it('skips fields that address rather than say something', () => {
    const stamped = stampSourceHashes(
      { links: [{ id: 'about', text: 'About', href: '/about' }] },
      { links: [{ id: 'about', text: 'Acerca de', href: '/acerca' }] },
    ) as { links: Record<string, unknown>[] };

    expect(stamped.links[0]._sourceHashes).toEqual({
      text: sourceHash('About'),
    });
  });

  it('hashes a positional list as one value, since a language row replaces it whole', () => {
    const stamped = stampSourceHashes(
      { textSectionsHtml: ['<p>One</p>', '<p>Two</p>'] },
      { textSectionsHtml: ['<p>Uno</p>'] },
    ) as Record<string, unknown>;

    expect(stamped._sourceHashes).toEqual({
      textSectionsHtml: sourceHash(
        JSON.stringify(['<p>One</p>', '<p>Two</p>']),
      ),
    });
  });

  it('pairs list items by id rather than by position', () => {
    const stamped = stampSourceHashes(englishFaq, {
      categories: [
        {
          id: 'applying',
          items: [{ id: 'when', answerHtml: '<p>Cuando sea.</p>' }],
        },
      ],
    }) as typeof spanishFaq;

    expect(
      (stamped.categories[0].items[0] as Record<string, unknown>)._sourceHashes,
    ).toEqual({ answerHtml: sourceHash('<p>Any time.</p>') });
  });

  it('drops a stale hash when the field no longer has a hashable English value', () => {
    const stamped = stampSourceHashes(
      { contact: { hours: null } },
      {
        contact: {
          hours: 'Lunes a viernes',
          _sourceHashes: { hours: 'no-longer-valid' },
        },
      },
    ) as { contact: Record<string, unknown> };

    expect(stamped.contact._sourceHashes).toBeUndefined();
  });
});

describe('staleFieldPaths', () => {
  it('reports a field whose English source has changed', () => {
    const stamped = stampSourceHashes(englishFaq, spanishFaq);
    const changedEnglish = {
      categories: [
        {
          id: 'applying',
          title: 'Applying',
          items: [
            {
              id: 'how',
              question: 'How?',
              answerHtml: '<p>Apply online or by mail.</p>',
            },
          ],
        },
      ],
    };

    expect(staleFieldPaths(changedEnglish, stamped)).toEqual([
      'categories[applying].items[how].answerHtml',
    ]);
  });

  it('reports nothing while the English source is unchanged', () => {
    const stamped = stampSourceHashes(englishFaq, spanishFaq);

    expect(staleFieldPaths(englishFaq, stamped)).toEqual([]);
  });

  it('reports nothing for a field with no stored hash', () => {
    expect(staleFieldPaths(englishFaq, spanishFaq)).toEqual([]);
  });

  it('reports a positional list whose English entries changed', () => {
    const stamped = stampSourceHashes(
      { textSectionsHtml: ['<p>One</p>'] },
      { textSectionsHtml: ['<p>Uno</p>'] },
    );

    expect(
      staleFieldPaths({ textSectionsHtml: ['<p>One and a half</p>'] }, stamped),
    ).toEqual(['textSectionsHtml']);
  });
});
