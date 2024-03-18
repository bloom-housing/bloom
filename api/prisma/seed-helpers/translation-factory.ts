import { LanguagesEnum, Prisma } from '@prisma/client';

const translations = (jurisdictionName?: string, language?: LanguagesEnum) => {
  if (!language || language === LanguagesEnum.en) {
    return {
      t: {
        hello: 'Hello',
        seeListing: 'See Listing',
        partnersPortal: 'Partners Portal',
        viewListing: 'View Listing',
        editListing: 'Edit Listing',
        reviewListing: 'Review Listing',
      },
      footer: {
        line1: `${jurisdictionName || 'Bloom'}`,
        line2: '',
        thankYou: 'Thank you',
        footer: `${jurisdictionName || 'Bloom Housing'}`,
      },
      header: {
        logoUrl: 'https://housingbayarea.mtc.ca.gov/images/doorway-logo.png',
        logoTitle: 'Bloom Housing Portal',
      },
      invite: {
        hello: 'Welcome to the Partners Portal',
        confirmMyAccount: 'Confirm my account',
        inviteManageListings:
          'You will now be able to manage listings and applications that you are a part of from one centralized location.',
        inviteWelcomeMessage: 'Welcome to the Partners Portal at %{appUrl}.',
        toCompleteAccountCreation:
          'To complete your account creation, please click the link below:',
      },
      register: {
        welcome: 'Welcome',
        welcomeMessage:
          'Thank you for setting up your account on %{appUrl}. It will now be easier for you to start, save, and submit online applications for listings that appear on the site.',
        confirmMyAccount: 'Confirm my account',
        toConfirmAccountMessage:
          'To complete your account creation, please click the link below:',
      },
      changeEmail: {
        message: 'An email address change has been requested for your account.',
        changeMyEmail: 'Confirm email change',
        onChangeEmailMessage:
          'To confirm the change to your email address, please click the link below:',
      },
      confirmation: {
        subject: 'Your Application Confirmation',
        eligible: {
          fcfs: 'Eligible applicants will be contacted on a first come first serve basis until vacancies are filled.',
          lottery:
            'Once the application period closes, eligible applicants will be placed in order based on lottery rank order.',
          waitlist:
            'Eligible applicants will be placed on the waitlist on a first come first serve basis until waitlist spots are filled.',
          fcfsPreference:
            'Housing preferences, if applicable, will affect first come first serve order.',
          waitlistContact:
            'You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist.',
          lotteryPreference:
            'Housing preferences, if applicable, will affect lottery rank order.',
          waitlistPreference:
            'Housing preferences, if applicable, will affect waitlist order.',
        },
        interview:
          'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents.',
        whatToExpect: {
          FCFS: 'Applicants will be contacted by the property agent on a first come first serve basis until vacancies are filled.',
          lottery:
            'Applicants will be contacted by the agent in lottery rank order until vacancies are filled.',
          noLottery:
            'Applicants will be contacted by the agent in waitlist order until vacancies are filled.',
        },
        whileYouWait:
          'While you wait, there are things you can do to prepare for potential next steps and future opportunities.',
        shouldBeChosen:
          'Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.',
        whatHappensNext: 'What happens next?',
        whatToExpectNext: 'What to expect next:',
        needToMakeUpdates: 'Need to make updates?',
        applicationsClosed: 'Application <br />closed',
        applicationsRanked: 'Application <br />ranked',
        eligibleApplicants: {
          FCFS: 'Eligible applicants will be placed in order based on <strong>first come first serve</strong> basis.',
          lottery:
            'Eligible applicants will be placed in order <strong>based on preference and lottery rank</strong>.',
          lotteryDate: 'The lottery will be held on %{lotteryDate}.',
        },
        applicationReceived: 'Application <br />received',
        prepareForNextSteps: 'Prepare for next steps',
        thankYouForApplying:
          'Thanks for applying. We have received your application for',
        readHowYouCanPrepare: 'Read about how you can prepare for next steps',
        yourConfirmationNumber: 'Your Confirmation Number',
        applicationPeriodCloses:
          'Once the application period closes, the property manager will begin processing applications.',
        contactedForAnInterview:
          'If you are contacted for an interview, you will need to fill out a more detailed application and provide supporting documents.',
        gotYourConfirmationNumber: 'We got your application for',
      },
      leasingAgent: {
        officeHours: 'Office Hours:',
        propertyManager: 'Property Manager',
        contactAgentToUpdateInfo:
          'If you need to update information on your application, do not apply again. Instead, contact the agent for this listing.',
      },
      mfaCodeEmail: {
        message: 'Access code for your account has been requested.',
        mfaCode: 'Your access code is: %{singleUseCode}',
      },
      forgotPassword: {
        subject: 'Forgot your password?',
        callToAction:
          'If you did make this request, please click on the link below to reset your password:',
        passwordInfo:
          "Your password won't change until you access the link above and create a new one.",
        resetRequest:
          'A request to reset your Bloom Housing Portal website password for %{appUrl} has recently been made.',
        ignoreRequest: "If you didn't request this, please ignore this email.",
        changePassword: 'Change my password',
      },
      requestApproval: {
        header: 'Listing approval requested',
        partnerRequest:
          'A Partner has submitted an approval request to publish the %{listingName} listing.',
        logInToReviewStart: 'Please log into the',
        logInToReviewEnd:
          'and navigate to the listing detail page to review and publish.',
        accessListing:
          'To access the listing after logging in, please click the link below',
      },
      changesRequested: {
        header: 'Listing changes requested',
        adminRequestStart:
          'An administrator is requesting changes to the %{listingName} listing. Please log into the',
        adminRequestEnd:
          'and navigate to the listing detail page to view the request and edit the listing.',
      },
      listingApproved: {
        header: 'New published listing',
        adminApproved:
          'The %{listingName} listing has been approved and published by an administrator.',
        viewPublished:
          'To view the published listing, please click on the link below',
      },
      csvExport: {
        body: 'The attached file is %{fileDescription}. If you have any questions, please reach out to your administrator.',
        hello: 'Hello,',
        title: '%{title}',
      },
      singleUseCodeEmail: {
        greeting: 'Hi',
        message:
          'Use the following code to sign in to your %{jurisdictionName} account. This code will be valid for 5 minutes. Never share this code.',
        singleUseCode: '%{singleUseCode}',
      },
      rentalOpportunity: {
        subject: 'New rental opportunity',
        intro: 'Rental opportunity at',
        applicationsDue: 'Applications Due',
        community: 'Community',
        address: 'Address',
        rent: 'Rent',
        minIncome: 'Minimum Income',
        maxIncome: 'Maximum Income',
        lottery: 'Lottery Date',
        studio: 'Studios',
        oneBdrm: '1 Bedrooms',
        twoBdrm: '2 Bedrooms',
        threeBdrm: '3 Bedrooms',
        fourBdrm: '4 Bedrooms',
        fiveBdrm: '5 Bedrooms',
        SRO: 'SROs',
        viewButton: {
          en: 'View listing & apply',
          es: 'Ver listado y aplicar',
          zh: '查看列表并申请',
          vi: 'Xem danh sách và áp dụng',
          tl: 'Tingnan ang listahan at mag-apply',
        },
      },
    };
  } else if (language === LanguagesEnum.es) {
    return {
      t: { seeListing: 'VER EL LISTADO' },
      footer: {
        line1: `${jurisdictionName || 'Bloom'}`,
        line2: '',
      },
      confirmation: {
        eligible: {
          waitlist:
            'Los solicitantes que reúnan los requisitos quedarán en la lista de espera por orden de recepción de solicitud hasta que se cubran todos los lugares.',
          waitlistContact:
            'Es posible que se comuniquen con usted mientras esté en la lista de espera para confirmar que desea permanecer en la lista.',
          waitlistPreference:
            'Las preferencias de vivienda, si corresponde, afectarán al orden de la lista de espera.',
        },
        interview:
          'Si se comunican con usted para una entrevista, se le pedirá que complete una solicitud más detallada y presente documentos de respaldo.',
        whatHappensNext: '¿Qué sucede luego?',
        needToMakeUpdates: '¿Necesita hacer modificaciones?',
        applicationsClosed: 'Solicitud <br />cerrada',
        applicationsRanked: 'Solicitud <br />clasificada',
        applicationReceived: 'Aplicación <br />recibida',
        yourConfirmationNumber: 'Su número de confirmación',
        gotYourConfirmationNumber: 'Recibimos tu solicitud para:',
      },
      leasingAgent: {
        officeHours: 'Horario de atención',
        propertyManager: 'Administrador de propiedades',
        contactAgentToUpdateInfo:
          'Si necesita modificar información en su solicitud, no haga una solicitud nueva. Comuníquese con el agente de este listado.',
      },
    };
  }
};

export const translationFactory = (
  jurisdictionId?: string,
  jurisdictionName?: string,
  language?: LanguagesEnum,
): Prisma.TranslationsCreateInput => {
  return {
    language: language || LanguagesEnum.en,
    translations: translations(jurisdictionName, language),
    jurisdictions: jurisdictionId
      ? {
          connect: {
            id: jurisdictionId,
          },
        }
      : undefined,
  };
};
