import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class updateSanJoseEmailTranslations1645051898243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First update the existing English translation for San Jose:
    let sanJoseJurisdiction = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Jose' LIMIT 1`
    )

    if (sanJoseJurisdiction.length === 0) return

    sanJoseJurisdiction = sanJoseJurisdiction[0].id

    let sanJoseTranslation = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.en]
    )
    sanJoseTranslation = sanJoseTranslation["0"]["translations"]

    if (!sanJoseTranslation.confirmation) sanJoseTranslation.confirmation = {}
    sanJoseTranslation.confirmation.thankYouForApplying =
      "Thanks for applying for housing from the San Jose Doorway Portal. We have received your application for"
    ;(sanJoseTranslation.footer.thankYou = "Thanks!"),
      await queryRunner.query(
        `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
        [sanJoseTranslation, sanJoseJurisdiction, Language.en]
      )

    // Now add additional translations

    // Spanish
    let sanJoseSpanish = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.es]
    )
    if (sanJoseSpanish.length === 0) {
      sanJoseSpanish = {
        t: {
          hello: "Hola",
        },
        confirmation: {
          yourConfirmationNumber: "Aquí tiene su número de confirmación:",
          shouldBeChosen:
            "Si su solicitud es elegida, prepárese para llenar una solicitud más detallada y proporcionar los documentos de apoyo necesarios.",
          subject: "Confirmación de su solicitud",
          thankYouForApplying:
            "Gracias por solicitar una vivienda desde el Portal de San José. Hemos recibido su solicitud para",
          whatToExpectNext: "Qué esperar a continuación:",
          whatToExpect: {
            FCFS:
              "El agente inmobiliario se pondrá en contacto con los solicitantes por orden de llegada hasta que se cubran las vacantes.",
            noLottery:
              "Los solicitantes serán contactados por el agente en orden de lista de espera hasta que se cubran las vacantes.",
          },
        },
        leasingAgent: {
          contactAgentToUpdateInfo:
            "Si necesita actualizar la información de su solicitud, no vuelva a presentarla. Póngase en contacto con el agente. Vea a continuación la información de contacto del agente para este listado.",
          officeHours: "Horario de oficina:",
        },
        footer: {
          footer: "Ciudad de San José, Departamento de Vivienda",
          thankYou: "¡Gracias!",
        },
        register: {
          confirmMyAccount: "Confirmar mi cuenta",
          toConfirmAccountMessage:
            "Para completar la creación de su cuenta, haga clic en el siguiente enlace:",
          welcome: "¡Bienvenido!",
          welcomeMessage:
            "Gracias por crear su cuenta en %{appUrl}. Ahora le será más fácil iniciar, guardar y enviar solicitudes en línea para los listados que aparecen en el sitio.",
        },
        forgotPassword: {
          callToAction:
            "Si usted hizo esta solicitud, haga clic en el enlace de abajo para restablecer su contraseña:",
          changePassword: "Cambiar mi contraseña",
          ignoreRequest: "Si usted no lo solicitó, ignore este correo electrónico.",
          passwordInfo:
            "Su contraseña no cambiará hasta que acceda al enlace anterior y cree una nueva.",
          resetRequest:
            "Recientemente se ha solicitado el restablecimiento de su contraseña del sitio web del Portal de Vivienda Bloom para %{appUrl}.",
          subject: "Forgot your password?",
        },
      }
      await queryRunner.query(
        `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
        [sanJoseJurisdiction, Language.es, sanJoseSpanish]
      )
    }

    // Vietnamese
    let sanJoseVietnamese = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.vi]
    )
    if (sanJoseVietnamese.length === 0) {
      sanJoseVietnamese = {
        t: {
          hello: "Xin chào",
        },
        confirmation: {
          yourConfirmationNumber: "Đây là số xác nhận của bạn:",
          shouldBeChosen:
            "Nếu đơn đăng ký của bạn được chọn, hãy chuẩn bị để điền vào đơn đăng ký chi tiết hơn và cung cấp các tài liệu hỗ trợ cần thiết.",
          subject: "Xác Nhận Đơn Đăng Ký Của Bạn",
          thankYouForApplying:
            "Cảm ơn bạn đã nộp đơn xin gia cư từ Cổng thông tin San Jose Doorway. Chúng tôi đã nhận được đơn đăng ký của bạn cho",
          whatToExpectNext: "Điều gì sẽ xảy ra tiếp theo:",
          whatToExpect: {
            FCFS:
              "Các ứng viên sẽ được đại lý tài sản liên hệ trên cơ sở ai đến trước phục vụ trước cho đến khi các chỗ trống được chiếm ngụ.",
            noLottery:
              "Các ứng viên sẽ được đại diện liên hệ theo thứ tự trong danh sách chờ cho đến khi các chỗ trống được chiếm ngụ.",
          },
        },
        leasingAgent: {
          contactAgentToUpdateInfo:
            "Nếu bạn cần cập nhật thông tin trên đơn đăng ký của mình, thì đừng đăng ký lại. Liên hệ với đại lý. Xem bên dưới để biết thông tin liên hệ với Đại lý cho danh sách này.",
          officeHours: "Giờ Hành Chính:",
        },
        footer: {
          footer: "Thành Phố San José, Sở Gia Cư",
          thankYou: "Cảm ơn!",
        },
        register: {
          confirmMyAccount: "Xác nhận tài khoản của tôi",
          toConfirmAccountMessage:
            "Để hoàn tất việc tạo tài khoản của bạn, vui lòng nhấp vào liên kết bên dưới:",
          welcome: "Chào mừng!",
          welcomeMessage:
            "Cảm ơn bạn đã thiết lập tài khoản của mình trên %{appUrl}. Giờ đây bạn sẽ dễ dàng hơn khi bắt đầu, lưu và gửi đơn đăng ký trực tuyến cho các danh sách có trên trang web.",
        },
        forgotPassword: {
          callToAction:
            "Nếu bạn thực hiện yêu cầu này, vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:",
          changePassword: "Thay đổi mật khẩu của tôi",
          ignoreRequest: "Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.",
          passwordInfo:
            "Mật khẩu của bạn sẽ không thay đổi cho đến khi bạn truy cập vào liên kết ở trên và tạo một mật khẩu mới.",
          resetRequest:
            "Yêu cầu đặt lại mật khẩu trang web Bloom Housing Portal của bạn cho %{appUrl} gần đây đã được thực hiện.",
          subject: "Forgot your password?",
        },
      }
      await queryRunner.query(
        `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
        [sanJoseJurisdiction, Language.vi, sanJoseVietnamese]
      )
    }

    // Chinese
    let sanJoseChinese = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.zh]
    )
    if (sanJoseChinese.length === 0) {
      sanJoseChinese = {
        t: {
          hello: "您好",
        },
        confirmation: {
          yourConfirmationNumber: "這是您的確認號碼:",
          shouldBeChosen:
            "如果選中您的申請表，請準備填寫一份更詳細的申請表，並提供所需的證明文件。",
          subject: "您的申請確認",
          thankYouForApplying: "感謝您透過聖荷西門戶網站申請住房。我們收到了您關於 的申請",
          whatToExpectNext: "後續流程:",
          whatToExpect: {
            FCFS: "房地產代理人會以先到先得的方式聯繫申請人，直到額滿為止。",
            noLottery: "代理人會按照候補名單順序聯繫申請人，直到額滿為止。",
          },
        },
        leasingAgent: {
          contactAgentToUpdateInfo:
            "如果您需要更新申請資訊，請勿再次申請。請聯繫租賃代理人。請參閱本物業清單所列代理人的聯繫資訊。",
          officeHours: "辦公時間:",
        },
        footer: {
          footer: "聖荷西市住房局",
          thankYou: "謝謝您！",
        },
        register: {
          confirmMyAccount: "聖荷西市住房局",
          toConfirmAccountMessage: "要完成建立帳戶，請按以下連結:",
          welcome: "歡迎！",
          welcomeMessage:
            "感謝您在%{appUrl}建立帳戶。現在，您可以更輕鬆地針對網站列出的物業清單建立、儲存及提交線上申請。",
        },
        forgotPassword: {
          callToAction: "如果您確實提出請求，請按下方連結重設密碼:",
          changePassword: "變更密碼",
          ignoreRequest: "如果您沒有提出請求，請勿理會本電子郵件。",
          passwordInfo: "在您按上方連結並建立一個新密碼之前，您的密碼不會變更。",
          resetRequest: "最近我們收到了您為%{appUrl}重設Bloom住房門戶網站密碼的請求。",
          subject: "Forgot your password?",
        },
      }
      await queryRunner.query(
        `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
        [sanJoseJurisdiction, Language.zh, sanJoseChinese]
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
