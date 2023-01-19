import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class addSJConfirmationEmailTranslations1673475687823 implements MigrationInterface {
  name = "addSJConfirmationEmailTranslations1673475687823"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ id: sanJoseJurisdiction }] = await queryRunner.query(
      `SELECT id FROM jurisdictions WHERE name = 'San Jose' LIMIT 1`
    )

    let sjSpanish = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.es]
    )

    sjSpanish = sjSpanish["0"]["translations"]
    sjSpanish.confirmation = {
      ...sjSpanish.confirmation,
      gotYourConfirmationNumber: "Recibimos tu solicitud para:",
      applicationReceived: "Aplicación <br />recibida",
      applicationsClosed: "Solicitud <br />cerrada",
      applicationsRanked: "Solicitud <br />clasificada",
      whatHappensNext: "¿Qué pasa después?",
      needToMakeUpdates: "¿Necesitas hacer actualizaciones?",
    }
    sjSpanish.leasingAgent.propertyManager = "Administrador de la propiedad"
    sjSpanish.leasingAgent.officeHours = "Horas de oficina"
    sjSpanish.t.seeListing = "VER LISTADO"
    sjSpanish.footer.line1 =
      "El Portal de la Vivienda de la Ciudad de San José es un proyecto de la"
    sjSpanish.footer.line2 = "Ciudad de San José - Departamento de Vivienda"

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [sjSpanish, sanJoseJurisdiction, Language.es]
    )

    let sjChinese = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.zh]
    )

    sjChinese = sjChinese["0"]["translations"]
    sjChinese.confirmation = {
      ...sjChinese.confirmation,
      gotYourConfirmationNumber: "我們收到了您的申請：",
      applicationReceived: "申請 <br />已收到",
      applicationsClosed: "申請 <br />關閉",
      applicationsRanked: "申請 <br />排名",
      whatHappensNext: "接下來發生什麼？",
      needToMakeUpdates: "需要更新嗎？",
    }
    sjChinese.leasingAgent.propertyManager = "物業經理"
    sjChinese.leasingAgent.officeHours = "工作時間"
    sjChinese.t.seeListing = "查看清單"
    sjChinese.footer.line1 = "聖何塞市住房門戶網站是"
    sjChinese.footer.line2 = "聖何塞市 - 住房部"

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [sjChinese, sanJoseJurisdiction, Language.zh]
    )

    let sjVietnamese = await queryRunner.query(
      `SELECT translations FROM translations WHERE jurisdiction_id = ($1) AND language = ($2)`,
      [sanJoseJurisdiction, Language.vi]
    )

    sjVietnamese = sjVietnamese["0"]["translations"]
    sjVietnamese.confirmation = {
      ...sjVietnamese.confirmation,
      gotYourConfirmationNumber: "Chúng tôi đã nhận được ứng dụng của bạn cho:",
      applicationReceived: "Ứng dụng <br />nhận được",
      applicationsClosed: "Ứng dụng <br />đã đóng",
      applicationsRanked: "Ứng dụng <br />được xếp hạng",
      whatHappensNext: "Chuyện gì xảy ra tiếp theo?",
      needToMakeUpdates: "Cần thực hiện cập nhật?",
    }
    sjVietnamese.leasingAgent.propertyManager = "Quản lý tài sản"
    sjVietnamese.leasingAgent.officeHours = "Giờ hành chính"
    sjVietnamese.t.seeListing = "XEM DANH SÁCH"
    sjVietnamese.footer.line1 = "Cổng thông tin nhà ở thành phố San Jose là một dự án của"
    sjVietnamese.footer.line2 = "Thành Phố San José - Bộ Gia Cư"

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [sjVietnamese, sanJoseJurisdiction, Language.vi]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
