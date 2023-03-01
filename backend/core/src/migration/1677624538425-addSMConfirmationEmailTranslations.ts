import {MigrationInterface, QueryRunner} from "typeorm";
import { Language } from "../shared/types/language-enum"

export class addSMConfirmationEmailTranslations1677624538425 implements MigrationInterface {
    name = 'addSMConfirmationEmailTranslations1677624538425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [{ id: sanMateoJurisdiction }] = await queryRunner.query(
          `SELECT id FROM jurisdictions WHERE name = 'San Mateo' LIMIT 1`
        )

        const smSpanish = {
            confirmation: {
              gotYourConfirmationNumber: "Recibimos tu solicitud de",
              yourConfirmationNumber: "Su número de confirmación",
              applicationReceived: "Aplicación <br />recibida",
              applicationsClosed: "Solicitud <br />cerrada",
              applicationsRanked: "Solicitud <br />clasificada",
              whatHappensNext: "¿Qué pasa después?",
              needToMakeUpdates: "¿Necesitas hacer actualizaciones?",
              interview:
                "Si lo contactan para una entrevista, se le pedirá que llene una solicitud más detallada y proporcione documentos de respaldo.",
              eligible: {
                fcfs:
                  "Los solicitantes elegibles serán contactados por orden de llegada hasta que se llenen las vacantes.",
                fcfsPreference:
                  "Las preferencias de alojamiento, si corresponde, afectarán el orden de llegada."
              }
            },
            leasingAgent: {
              contactAgentToUpdateInfo:
              "Si necesita actualizar la información de su solicitud, no vuelva a presentarla. En su lugar, comuníquese con el agente para este listado.",
              propertyManager: "Administrador de la propiedad",
              officeHours: "Horas de oficina",
            },
            t: {
              seeListing: "VER LISTADO",
            },
        };

        await queryRunner.query(
          `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
          [sanMateoJurisdiction, Language.es, smSpanish]
        )

      const smChinese = {
        jurisdictionId: sanMateoJurisdiction,
        language: Language.zh,
        confirmation: {
          gotYourConfirmationNumber: "我們收到了您的申請",
          yourConfirmationNumber: "您的確認號碼",
          applicationReceived: "申請 <br />已收到",
          applicationsClosed: "申請 <br />關閉",
          applicationsRanked: "申請 <br />排名",
          whatHappensNext: "接下來發生什麼？",
          needToMakeUpdates: "需要更新嗎？",
          interview:
            "如果聯繫您進行面試，您將被要求填寫更詳細的申請表並提供證明文件。",
          eligible: {
            fcfs:
              "符合條件的申請人將以先到先得的方式聯繫，直到職位空缺被填補。",
            fcfsPreference:
              "住房偏好（如果適用）將影響先到先得的順序。",
          },
        },
        leasingAgent: {
          contactAgentToUpdateInfo:
            "如果您需要更新申請信息，請勿再次申請。 相反，請聯繫此列表的代理。",
          propertyManager: "物業經理",
          officeHours: "工作時間",
        },
        t: {
          seeListing: "查看列表",
        },
      };

      await queryRunner.query(
        `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
        [sanMateoJurisdiction, Language.zh, smChinese]
      )

      const smVietnamese = {
        jurisdictionId: sanMateoJurisdiction,
        language: Language.vi,
        confirmation: {
          gotYourConfirmationNumber: "Chúng tôi đã nhận được ứng dụng của bạn cho",
          yourConfirmationNumber: "Số xác nhận của bạn",
          applicationReceived: "Ứng dụng <br />nhận được",
          applicationsClosed: "Ứng dụng <br />đã đóng",
          applicationsRanked: "Ứng dụng <br />được xếp hạng",
          whatHappensNext: "Chuyện gì xảy ra tiếp theo?",
          needToMakeUpdates: "Cần thực hiện cập nhật?",
          interview:
            "Nếu bạn được liên hệ để phỏng vấn, bạn sẽ được yêu cầu điền vào một đơn đăng ký chi tiết hơn và cung cấp các tài liệu hỗ trợ.",
          eligible: {
            fcfs:
              "Các ứng viên đủ điều kiện sẽ được liên hệ trên cơ sở ai đến trước được phục vụ trước cho đến khi các vị trí tuyển dụng được lấp đầy.",
            fcfsPreference:
              "Ưu đãi về nhà ở, nếu áp dụng, sẽ ảnh hưởng đến thứ tự ai đến trước được phục vụ trước.",
          },
        },
        leasingAgent: {
          contactAgentToUpdateInfo:
            "Nếu bạn cần cập nhật thông tin trên ứng dụng của mình, đừng đăng ký lại. Thay vào đó, hãy liên hệ với đại lý cho danh sách này.",
          propertyManager: "Quản lý tài sản",
          officeHours: "Giờ hành chính",
        },
        t: {
          seeListing: "XEM DANH SÁCH",
        },
      };

      await queryRunner.query(
        `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
        [sanMateoJurisdiction, Language.vi, smVietnamese]
      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}

}
