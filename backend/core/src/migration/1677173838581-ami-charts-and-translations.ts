import { MigrationInterface, QueryRunner } from "typeorm"
import { alamedaTCAC2022 } from "../seeder/seeds/ami-charts/alameda-tcac-2022"
import { alamedaHUD2022 } from "../seeder/seeds/ami-charts/alameda-hud-2022"
import { sanMateoHUD } from "../seeder/seeds/ami-charts/sanMateoHUD"
import { sanMateoTCAC } from "../seeder/seeds/ami-charts/sanMateoTCAC"
import { sanJoseHcdIncomeLimits2022 } from "../seeder/seeds/ami-charts/san-jose-hcd-income-limits-2022"
import { sanJoseHudHome2022 } from "../seeder/seeds/ami-charts/san-jose-hud-home-2022"

export class amiChartsAndTranslations1677173838581 implements MigrationInterface {
  name = "amiChartsAndTranslations1677173838581"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id: alamedaId }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'Alameda'`
    )
    await queryRunner.query(
      `INSERT INTO ami_chart
            (name, items, jurisdiction_id)
            VALUES ('${alamedaTCAC2022.name}', '${JSON.stringify(
        alamedaTCAC2022.items
      )}', '${alamedaId}')
          `
    )

    await queryRunner.query(
      `INSERT INTO ami_chart
            (name, items, jurisdiction_id)
            VALUES ('${alamedaHUD2022.name}', '${JSON.stringify(
        alamedaHUD2022.items
      )}', '${alamedaId}')
          `
    )

    const [{ id: smcId }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Mateo'`
    )
    await queryRunner.query(
      `ALTER TABLE "jurisdictions" ALTER COLUMN "rental_assistance_default" DROP DEFAULT`
    )

    await queryRunner.query(
      `INSERT INTO ami_chart
                  (name, items, jurisdiction_id)
                  VALUES ('${sanMateoHUD.name}', '${JSON.stringify(sanMateoHUD.items)}', '${smcId}')
                `
    )

    await queryRunner.query(
      `INSERT INTO ami_chart
                  (name, items, jurisdiction_id)
                  VALUES ('${sanMateoTCAC.name}', '${JSON.stringify(
        sanMateoTCAC.items
      )}', '${alamedaId}')
                `
    )

    const [{ id: sjId }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Jose'`
    )

    await queryRunner.query(
      `INSERT INTO ami_chart
                (name, items, jurisdiction_id)
                VALUES ('${sanJoseHcdIncomeLimits2022.name}', '${JSON.stringify(
        sanJoseHcdIncomeLimits2022.items
      )}', '${sjId}')
            `
    )

    await queryRunner.query(
      `INSERT INTO ami_chart
                (name, items, jurisdiction_id)
                VALUES ('${sanJoseHudHome2022.name}', '${JSON.stringify(
        sanJoseHudHome2022.items
      )}', '${sjId}')
                `
    )

    // Reset the translations table
    await queryRunner.query(`DELETE FROM translations`)

    // English with no jurisdiction
    const defaultTranslations = {
      t: { hello: "Hello", seeListing: "See Listing" },
      footer: {
        line1:
          "Alameda County Housing Portal is a project of the Alameda County - Housing and Community Development (HCD) Department",
        line2: "",
        thankYou: "Thank you",
      },
      header: {
        logoUrl:
          "https://res.cloudinary.com/exygy/image/upload/v1652459319/housingbayarea/163838489-d5a1bc08-7d69-4c4a-8a94-8485617d8b46_dkkqvw.png",
        logoTitle: "Alameda County Housing Portal",
      },
      invite: {
        hello: "Welcome to the Partners Portal",
        confirmMyAccount: "Confirm my account",
        inviteManageListings:
          "You will now be able to manage listings and applications that you are a part of from one centralized location.",
        inviteWelcomeMessage: "Welcome to the Partners Portal at %{appUrl}.",
        toCompleteAccountCreation:
          "To complete your account creation, please click the link below:",
      },
      register: {
        welcome: "Welcome",
        welcomeMessage:
          "Thank you for setting up your account on %{appUrl}. It will now be easier for you to start, save, and submit online applications for listings that appear on the site.",
        confirmMyAccount: "Confirm my account",
        toConfirmAccountMessage: "To complete your account creation, please click the link below:",
      },
      changeEmail: {
        message: "An email address change has been requested for your account.",
        changeMyEmail: "Confirm email change",
        onChangeEmailMessage:
          "To confirm the change to your email address, please click the link below:",
      },
      confirmation: {
        subject: "Your Application Confirmation",
        eligible: {
          fcfs:
            "Eligible applicants will be contacted on a first come first serve basis until vacancies are filled.",
          lottery:
            "Once the application period closes, eligible applicants will be placed in order based on lottery rank order.",
          waitlist:
            "Eligible applicants will be placed on the waitlist on a first come first serve basis until waitlist spots are filled.",
          fcfsPreference:
            "Housing preferences, if applicable, will affect first come first serve order.",
          waitlistContact:
            "You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist.",
          lotteryPreference: "Housing preferences, if applicable, will affect lottery rank order.",
          waitlistPreference: "Housing preferences, if applicable, will affect waitlist order.",
        },
        interview:
          "If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents.",
        whatToExpect: {
          FCFS:
            "Applicants will be contacted by the property agent on a first come first serve basis until vacancies are filled.",
          lottery:
            "Applicants will be contacted by the agent in lottery rank order until vacancies are filled.",
          noLottery:
            "Applicants will be contacted by the agent in waitlist order until vacancies are filled.",
        },
        whileYouWait:
          "While you wait, there are things you can do to prepare for potential next steps and future opportunities.",
        shouldBeChosen:
          "Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.",
        whatHappensNext: "What happens next?",
        whatToExpectNext: "What to expect next:",
        needToMakeUpdates: "Need to make updates?",
        applicationsClosed: "Application <br />closed",
        applicationsRanked: "Application <br />ranked",
        eligibleApplicants: {
          FCFS:
            "Eligible applicants will be placed in order based on <strong>first come first serve</strong> basis.",
          lottery:
            "Eligible applicants will be placed in order <strong>based on preference and lottery rank</strong>.",
          lotteryDate: "The lottery will be held on %{lotteryDate}.",
        },
        applicationReceived: "Application <br />received",
        prepareForNextSteps: "Prepare for next steps",
        thankYouForApplying: "Thanks for applying. We have received your application for",
        readHowYouCanPrepare: "Read about how you can prepare for next steps",
        yourConfirmationNumber: "Your Confirmation Number",
        applicationPeriodCloses:
          "Once the application period closes, the property manager will begin processing applications.",
        contactedForAnInterview:
          "If you are contacted for an interview, you will need to fill out a more detailed application and provide supporting documents.",
        gotYourConfirmationNumber: "We got your application for",
      },
      leasingAgent: {
        officeHours: "Office Hours:",
        propertyManager: "Property Manager",
        contactAgentToUpdateInfo:
          "If you need to update information on your application, do not apply again. Instead, contact the agent for this listing.",
      },
      mfaCodeEmail: {
        message: "Access token for your account has been requested.",
        mfaCode: "Your access token is: %{mfaCode}",
      },
      forgotPassword: {
        subject: "Forgot your password?",
        callToAction:
          "If you did make this request, please click on the link below to reset your password:",
        passwordInfo:
          "Your password won't change until you access the link above and create a new one.",
        resetRequest:
          "A request to reset your Bloom Housing Portal website password for %{appUrl} has recently been made.",
        ignoreRequest: "If you didn't request this, please ignore this email.",
        changePassword: "Change my password",
      },
    }
    await queryRunner.query(`INSERT INTO translations (language, translations) VALUES ($1, $2)`, [
      "en",
      JSON.stringify(defaultTranslations),
    ])

    // Alameda translations
    const englishAlameda = {
      footer: {
        line1: "Alameda County Housing Portal is a project of the",
        line2: "Alameda County - Housing and Community Development (HCD) Department",
        footer: "Alameda County - Housing and Community Development (HCD) Department",
        thankYou: "Thank you",
      },
      header: {
        logoUrl:
          "https://res.cloudinary.com/exygy/image/upload/v1652459319/housingbayarea/163838489-d5a1bc08-7d69-4c4a-8a94-8485617d8b46_dkkqvw.png",
        logoTitle: "Alameda County Housing Portal",
      },
      changeEmail: {
        message: "An email address change has been requested for your account.",
        changeMyEmail: "Confirm email change",
        onChangeEmailMessage:
          "To confirm the change to your email address, please click the link below:",
      },
      mfaCodeEmail: {
        message: "Access token for your account has been requested.",
        mfaCode: "Your access token is: %{mfaCode}",
      },
    }
    await queryRunner.query(
      `INSERT INTO translations (language, translations, jurisdiction_id) VALUES ($1, $2, $3)`,
      ["en", JSON.stringify(englishAlameda), alamedaId]
    )

    // San Jose translations
    const sanJoseEnglish = {
      footer: {
        line1: "City of San José Housing Portal is a project of the",
        line2: "City of San José - Housing Department",
        footer: "City of San José, Housing Department",
        thankYou: "Thanks!",
      },
      header: {
        logoUrl:
          "https://res.cloudinary.com/exygy/image/upload/v1652459304/housingbayarea/163838487-7279a41f-4ec5-4da0-818b-4df3351a7971_yjnjh7.png",
        logoTitle: "City of San José Housing Portal",
      },
      changeEmail: {
        message: "An email address change has been requested for your account.",
        changeMyEmail: "Confirm email change",
        onChangeEmailMessage:
          "To confirm the change to your email address, please click the link below:",
      },
      confirmation: {
        thankYouForApplying:
          "Thanks for applying for housing from the San Jose Doorway Portal. We have received your application for",
      },
      mfaCodeEmail: {
        message: "Access token for your account has been requested.",
        mfaCode: "Your access token is: %{mfaCode}",
      },
    }
    await queryRunner.query(
      `INSERT INTO translations (language, translations, jurisdiction_id) VALUES ($1, $2, $3)`,
      ["en", JSON.stringify(sanJoseEnglish), sjId]
    )

    const sanJoseVi = {
      t: { hello: "Xin chào", seeListing: "XEM DANH SÁCH" },
      footer: {
        line1: "Cổng thông tin nhà ở thành phố San Jose là một dự án của",
        line2: "Thành Phố San José - Bộ Gia Cư",
        footer: "Thành Phố San José, Sở Gia Cư",
        thankYou: "Cảm ơn!",
      },
      register: {
        welcome: "Chào mừng!",
        welcomeMessage:
          "Cảm ơn bạn đã thiết lập tài khoản của mình trên %{appUrl}. Giờ đây bạn sẽ dễ dàng hơn khi bắt đầu, lưu và gửi đơn đăng ký trực tuyến cho các danh sách có trên trang web.",
        confirmMyAccount: "Xác nhận tài khoản của tôi",
        toConfirmAccountMessage:
          "Để hoàn tất việc tạo tài khoản của bạn, vui lòng nhấp vào liên kết bên dưới:",
      },
      confirmation: {
        subject: "Xác Nhận Đơn Đăng Ký Của Bạn",
        eligible: {
          fcfs:
            "Những người nộp đơn hội đủ điều kiện sẽ được liên lạc trên cơ sở ai đến trước được phục vụ trước cho đến khi hết căn hộ trống.",
          lottery:
            "Sau khi thời gian nộp đơn kết thúc, những người nộp đơn hội đủ điều kiện sẽ được sắp xếp theo thứ tự dựa trên xếp hạng rút thăm.",
          waitlist:
            "Những người nộp đơn hội đủ điều kiện sẽ được ghi tên vào danh sách chờ trên cơ sở ai đến trước được phục vụ trước cho đến khi các vị trí trong danh sách chờ được lấp đầy.",
          fcfsPreference:
            "Các ưu tiên về nhà ở, nếu có, sẽ làm thay đổi thứ tự ai đến trước được phục vụ trước.",
          waitlistContact:
            "Chúng tôi có thể liên lạc với quý vị khi quý vị đang ở trong danh sách chờ để xác nhận rằng quý vị muốn tiếp tục ở lại trong danh sách chờ.",
          lotteryPreference:
            "Các ưu tiên về nhà ở, nếu có, sẽ làm thay đổi thứ tự xếp hạng rút thăm.",
          waitlistPreference:
            "Các ưu tiên về nhà ở, nếu có, sẽ làm thay đổi thứ tự trong danh sách chờ.Housing preferences, if applicable, will affect waitlist order.",
        },
        interview:
          "Nếu quý vị được mời tham gia phỏng vấn, quý vị sẽ được yêu cầu điền một đơn đăng ký chi tiết hơn và cung cấp các giấy tờ hỗ trợ cần thiết.",
        whatToExpect: {
          FCFS:
            "Các ứng viên sẽ được đại lý tài sản liên hệ trên cơ sở ai đến trước phục vụ trước cho đến khi các chỗ trống được chiếm ngụ.",
          noLottery:
            "Các ứng viên sẽ được đại diện liên hệ theo thứ tự trong danh sách chờ cho đến khi các chỗ trống được chiếm ngụ.",
        },
        shouldBeChosen:
          "Nếu đơn đăng ký của bạn được chọn, hãy chuẩn bị để điền vào đơn đăng ký chi tiết hơn và cung cấp các tài liệu hỗ trợ cần thiết.",
        whatHappensNext: "Chuyện gì xảy ra tiếp theo?",
        whatToExpectNext: "Điều gì sẽ xảy ra tiếp theo:",
        needToMakeUpdates: "Cần thực hiện cập nhật?",
        applicationsClosed: "Ứng dụng <br />đã đóng",
        applicationsRanked: "Ứng dụng <br />được xếp hạng",
        applicationReceived: "Ứng dụng <br />nhận được",
        thankYouForApplying:
          "Cảm ơn bạn đã nộp đơn xin gia cư từ Cổng thông tin San Jose Doorway. Chúng tôi đã nhận được đơn đăng ký của bạn cho",
        yourConfirmationNumber: "Đây là số xác nhận của bạn:",
        gotYourConfirmationNumber: "Chúng tôi đã nhận được ứng dụng của bạn cho:",
      },
      leasingAgent: {
        officeHours: "Giờ hành chính",
        propertyManager: "Quản lý tài sản",
        contactAgentToUpdateInfo:
          "Nếu bạn cần cập nhật thông tin trên đơn đăng ký của mình, thì đừng đăng ký lại. Liên hệ với đại lý. Xem bên dưới để biết thông tin liên hệ với Đại lý cho danh sách này.",
      },
      forgotPassword: {
        subject: "Forgot your password?",
        callToAction:
          "Nếu bạn thực hiện yêu cầu này, vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:",
        passwordInfo:
          "Mật khẩu của bạn sẽ không thay đổi cho đến khi bạn truy cập vào liên kết ở trên và tạo một mật khẩu mới.",
        resetRequest:
          "Yêu cầu đặt lại mật khẩu trang web Bloom Housing Portal của bạn cho %{appUrl} gần đây đã được thực hiện.",
        ignoreRequest: "Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.",
        changePassword: "Thay đổi mật khẩu của tôi",
      },
    }
    await queryRunner.query(
      `INSERT INTO translations (language, translations, jurisdiction_id) VALUES ($1, $2, $3)`,
      ["vi", JSON.stringify(sanJoseVi), sjId]
    )

    const sanJoseSpanish = {
      t: { hello: "Hola", seeListing: "VER LISTADO" },
      footer: {
        line1: "El Portal de la Vivienda de la Ciudad de San José es un proyecto de la",
        line2: "Ciudad de San José - Departamento de Vivienda",
        footer: "Ciudad de San José, Departamento de Vivienda",
        thankYou: "¡Gracias!",
      },
      register: {
        welcome: "¡Bienvenido!",
        welcomeMessage:
          "Gracias por crear su cuenta en %{appUrl}. Ahora le será más fácil iniciar, guardar y enviar solicitudes en línea para los listados que aparecen en el sitio.",
        confirmMyAccount: "Confirmar mi cuenta",
        toConfirmAccountMessage:
          "Para completar la creación de su cuenta, haga clic en el siguiente enlace:",
      },
      confirmation: {
        subject: "Confirmación de su solicitud",
        eligible: {
          fcfs:
            "Se contactará a los solicitantes elegibles por orden hasta que se cubran las vacantes.",
          lottery:
            "Una vez finalizado el período de solicitud, los solicitantes elegibles se ordenarán según el resultado de la lotería.",
          waitlist:
            "Los solicitantes elegibles se colocarán en la lista de espera por orden de llegada hasta que se llenen los lugares de la lista de espera.",
          fcfsPreference:
            "Las preferencias para la vivienda, si corresponden, alterarán el orden de postulación.",
          waitlistContact:
            "Es posible que se comuniquen con usted mientras esté en la lista de espera para confirmar que desea permanecer en ella.",
          lotteryPreference:
            "Las preferencias para la vivienda, si corresponden, alterarán el orden resultante de la lotería.",
          waitlistPreference:
            "Las preferencias para la vivienda, si corresponden, alterarán el orden en la lista de espera.",
        },
        interview:
          "Si se comunican con usted para una entrevista, se le pedirá que complete una solicitud más detallada y que proporcione documentos de respaldo.",
        whatToExpect: {
          FCFS:
            "El agente inmobiliario se pondrá en contacto con los solicitantes por orden de llegada hasta que se cubran las vacantes.",
          noLottery:
            "Los solicitantes serán contactados por el agente en orden de lista de espera hasta que se cubran las vacantes.",
        },
        shouldBeChosen:
          "Si su solicitud es elegida, prepárese para llenar una solicitud más detallada y proporcionar los documentos de apoyo necesarios.",
        whatHappensNext: "¿Qué pasa después?",
        whatToExpectNext: "Qué esperar a continuación:",
        needToMakeUpdates: "¿Necesitas hacer actualizaciones?",
        applicationsClosed: "Solicitud <br />cerrada",
        applicationsRanked: "Solicitud <br />clasificada",
        applicationReceived: "Aplicación <br />recibida",
        thankYouForApplying:
          "Gracias por solicitar una vivienda desde el Portal de San José. Hemos recibido su solicitud para",
        yourConfirmationNumber: "Aquí tiene su número de confirmación:",
        gotYourConfirmationNumber: "Recibimos tu solicitud para:",
      },
      leasingAgent: {
        officeHours: "Horas de oficina",
        propertyManager: "Administrador de la propiedad",
        contactAgentToUpdateInfo:
          "Si necesita actualizar la información de su solicitud, no vuelva a presentarla. Póngase en contacto con el agente. Vea a continuación la información de contacto del agente para este listado.",
      },
      forgotPassword: {
        subject: "Forgot your password?",
        callToAction:
          "Si usted hizo esta solicitud, haga clic en el enlace de abajo para restablecer su contraseña:",
        passwordInfo:
          "Su contraseña no cambiará hasta que acceda al enlace anterior y cree una nueva.",
        resetRequest:
          "Recientemente se ha solicitado el restablecimiento de su contraseña del sitio web del Portal de Vivienda Bloom para %{appUrl}.",
        ignoreRequest: "Si usted no lo solicitó, ignore este correo electrónico.",
        changePassword: "Cambiar mi contraseña",
      },
    }
    await queryRunner.query(
      `INSERT INTO translations (language, translations, jurisdiction_id) VALUES ($1, $2, $3)`,
      ["es", JSON.stringify(sanJoseSpanish), sjId]
    )

    const sanJoseChinese = {
      t: { hello: "您好", seeListing: "查看清單" },
      footer: {
        line1: "聖何塞市住房門戶網站是",
        line2: "聖何塞市 - 住房部",
        footer: "聖荷西市住房局",
        thankYou: "謝謝您！",
      },
      register: {
        welcome: "歡迎！",
        welcomeMessage:
          "感謝您在%{appUrl}建立帳戶。現在，您可以更輕鬆地針對網站列出的物業清單建立、儲存及提交線上申請。",
        confirmMyAccount: "聖荷西市住房局",
        toConfirmAccountMessage: "要完成建立帳戶，請按以下連結:",
      },
      confirmation: {
        subject: "您的申請確認",
        eligible: {
          fcfs: "我們將按照「先申請先入住」的原則聯絡合格的申請人，直至空置房被入住為止。",
          lottery: "一旦申請期結束，合格的申請人將按抽籤名次進行排序。",
          waitlist: "合格的申請人將按照「先申請先入住」的原則進入候補名單，直至候補名單額滿為止。",
          fcfsPreference: "住房優惠（如果適用）將影響「先申請先入住」順序。",
          waitlistContact: "我們可能會在您進入候補名單時與您聯絡，確認您希望繼續留在候補名單上。",
          lotteryPreference: "住房優惠（如果適用）將影響抽籤名次。",
          waitlistPreference: "住房優惠（如果適用）將影響候補名單的順序。",
        },
        interview: "如果我們聯絡您要求進行面談，您需要填寫更詳細的申請表並提供證明文件。",
        whatToExpect: {
          FCFS: "房地產代理人會以先到先得的方式聯繫申請人，直到額滿為止。",
          noLottery: "代理人會按照候補名單順序聯繫申請人，直到額滿為止。",
        },
        shouldBeChosen: "如果選中您的申請表，請準備填寫一份更詳細的申請表，並提供所需的證明文件。",
        whatHappensNext: "接下來發生什麼？",
        whatToExpectNext: "後續流程:",
        needToMakeUpdates: "需要更新嗎？",
        applicationsClosed: "申請 <br />關閉",
        applicationsRanked: "申請 <br />排名",
        applicationReceived: "申請 <br />已收到",
        thankYouForApplying: "感謝您透過聖荷西門戶網站申請住房。我們收到了您關於 的申請",
        yourConfirmationNumber: "這是您的確認號碼:",
        gotYourConfirmationNumber: "我們收到了您的申請：",
      },
      leasingAgent: {
        officeHours: "工作時間",
        propertyManager: "物業經理",
        contactAgentToUpdateInfo:
          "如果您需要更新申請資訊，請勿再次申請。請聯繫租賃代理人。請參閱本物業清單所列代理人的聯繫資訊。",
      },
      forgotPassword: {
        subject: "Forgot your password?",
        callToAction: "如果您確實提出請求，請按下方連結重設密碼:",
        passwordInfo: "在您按上方連結並建立一個新密碼之前，您的密碼不會變更。",
        resetRequest: "最近我們收到了您為%{appUrl}重設Bloom住房門戶網站密碼的請求。",
        ignoreRequest: "如果您沒有提出請求，請勿理會本電子郵件。",
        changePassword: "變更密碼",
      },
    }
    await queryRunner.query(
      `INSERT INTO translations (language, translations, jurisdiction_id) VALUES ($1, $2, $3)`,
      ["zh", JSON.stringify(sanJoseChinese), sjId]
    )

    // San Mateo translations
    const sanMateoEnglish = {
      footer: {
        line1: "San Mateo County Housing Portal is a project of the",
        line2: "San Mateo County - Department of Housing (DOH)",
        footer: "San Mateo County - Department of Housing",
        thankYou: "Thank you",
      },
      header: {
        logoUrl:
          "https://res.cloudinary.com/exygy/image/upload/v1652459282/housingbayarea/163838485-87dd8976-b816-424c-a303-93e5473e931e_qvnsml.png",
        logoTitle: "San Mateo County Housing",
      },
      changeEmail: {
        message: "An email address change has been requested for your account.",
        changeMyEmail: "Confirm email change",
        onChangeEmailMessage:
          "To confirm the change to your email address, please click the link below:",
      },
      mfaCodeEmail: {
        message: "Access token for your account has been requested.",
        mfaCode: "Your access token is: %{mfaCode}",
      },
    }
    await queryRunner.query(
      `INSERT INTO translations (language, translations, jurisdiction_id) VALUES ($1, $2, $3)`,
      ["en", JSON.stringify(sanMateoEnglish), smcId]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
