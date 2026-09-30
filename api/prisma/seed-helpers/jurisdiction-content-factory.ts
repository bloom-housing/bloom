import { LanguagesEnum, Prisma, PrismaClient } from '@prisma/client';

// Seed content for the structured-content endpoints. The English row is the jurisdictional default
// and the Spanish row is deliberately partial, so a merged read shows all three behaviors: a field
// the language row leaves unset falls back to English (contact), a list of items merges by id
// (footer links), and an item the language row does not translate keeps its English text
// (the second applying question).
const content = (
  jurisdiction?: { id: string; name: string },
  language?: LanguagesEnum,
) => {
  const name = jurisdiction?.name ?? 'Bloomington';

  if (language === LanguagesEnum.es) {
    return {
      footer: {
        textSectionsHtml: [`<p>${name} ofrece vivienda asequible.</p>`],
        links: [
          { id: 'about', text: 'Acerca de' },
          { id: 'contact', text: 'Contacto' },
          { id: 'accessibility', text: 'Accesibilidad' },
        ],
      },
      faq: {
        categories: [
          {
            id: 'applying',
            title: 'Solicitar',
            items: [
              {
                id: 'how-to-apply',
                question: '¿Como solicito un listado?',
                answerHtml:
                  '<p>Abra el listado y siga las instrucciones para solicitar en linea o por correo.</p>',
              },
            ],
          },
        ],
      },
      disclaimers: {
        privacyHtml:
          '<p>Su informacion se usa unicamente para procesar su solicitud.</p>',
      },
    };
  }

  return {
    footer: {
      textSectionsHtml: [`<p>${name} offers affordable housing.</p>`],
      links: [
        { id: 'about', text: 'About', href: '/about' },
        { id: 'contact', text: 'Contact', href: '/contact' },
        { id: 'accessibility', text: 'Accessibility', href: '/accessibility' },
      ],
    },
    faq: {
      categories: [
        {
          id: 'applying',
          title: 'Applying',
          items: [
            {
              id: 'how-to-apply',
              question: 'How do I apply for a listing?',
              answerHtml:
                '<p>Open the listing and follow its instructions to apply online or by mail.</p>',
            },
            {
              id: 'multiple-listings',
              question: 'Can I apply to more than one listing?',
              answerHtml:
                '<p>Yes. Each listing is a separate application with its own deadline.</p>',
            },
          ],
        },
        {
          id: 'eligibility',
          title: 'Eligibility',
          items: [
            {
              id: 'income-limits',
              question: 'How are income limits decided?',
              answerHtml:
                '<p>Limits are set per household size and are listed on each listing page.</p>',
            },
          ],
        },
      ],
    },
    resources: {
      contactCard: {
        departmentTitle: `${name} Housing Services`,
        description: 'Reach out with questions about applying or eligibility.',
        email: 'housing@example.com',
      },
      resourceSections: [
        {
          id: 'renters',
          sectionTitle: 'For renters',
          sectionSubtitle: 'Help with applications and tenancy',
          cards: [
            {
              id: 'tenant-rights',
              title: 'Tenant rights',
              href: 'https://example.com/tenant-rights',
              contentHtml:
                '<p>What to expect as a tenant, and where to get help.</p>',
            },
          ],
        },
      ],
    },
    disclaimers: {
      privacyHtml:
        '<p>Your information is used only to process your application.</p>',
      disclaimerHtml:
        '<p>Listing details are provided by property managers and may change.</p>',
    },
    contact: {
      phone: '(555) 555-0100',
      email: 'housing@example.com',
      addressHtml: '<p>1 Main Street<br />Suite 100</p>',
      hours: 'Monday to Friday, 9am to 5pm',
    },
  };
};

export const jurisdictionContentFactory = (optionalParams: {
  jurisdiction: { id: string; name: string };
  language?: LanguagesEnum;
}): Prisma.JurisdictionContentUncheckedCreateInput => {
  const language = optionalParams.language || LanguagesEnum.en;
  return {
    jurisdictionId: optionalParams.jurisdiction.id,
    language,
    ...content(optionalParams.jurisdiction, language),
  };
};

// The seed owns the row, so a re-run replaces its content rather than merging into whatever is
// there. Keyed on the (jurisdiction, language) unique index.
export async function upsertJurisdictionContent(
  prisma: PrismaClient,
  data: Prisma.JurisdictionContentUncheckedCreateInput,
): Promise<void> {
  const { jurisdictionId, language, ...fields } = data;
  await prisma.jurisdictionContent.upsert({
    where: { jurisdictionId_language: { jurisdictionId, language } },
    create: data,
    update: fields,
  });
}
