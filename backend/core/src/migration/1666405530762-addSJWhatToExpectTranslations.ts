import { MigrationInterface, QueryRunner } from "typeorm"
import { Language } from "../shared/types/language-enum"

export class addSJWhatToExpectTranslations1666405530762 implements MigrationInterface {
  name = "addSJWhatToExpectTranslations1666405530762"

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
      eligible: {
        fcfs:
          "Se contactará a los solicitantes elegibles por orden hasta que se cubran las vacantes.",
        fcfsPreference:
          "Las preferencias para la vivienda, si corresponden, alterarán el orden de postulación.",
        lottery:
          "Una vez finalizado el período de solicitud, los solicitantes elegibles se ordenarán según el resultado de la lotería.",
        lotteryPreference:
          "Las preferencias para la vivienda, si corresponden, alterarán el orden resultante de la lotería.",
        waitlist:
          "Los solicitantes elegibles se colocarán en la lista de espera por orden de llegada hasta que se llenen los lugares de la lista de espera.",
        waitlistPreference:
          "Las preferencias para la vivienda, si corresponden, alterarán el orden en la lista de espera.",
        waitlistContact:
          "Es posible que se comuniquen con usted mientras esté en la lista de espera para confirmar que desea permanecer en ella.",
      },
      interview:
        "Si se comunican con usted para una entrevista, se le pedirá que complete una solicitud más detallada y que proporcione documentos de respaldo.",
    }

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
      eligible: {
        fcfs: "我們將按照「先申請先入住」的原則聯絡合格的申請人，直至空置房被入住為止。",
        fcfsPreference: "住房優惠（如果適用）將影響「先申請先入住」順序。",
        lottery: "一旦申請期結束，合格的申請人將按抽籤名次進行排序。",
        lotteryPreference: "住房優惠（如果適用）將影響抽籤名次。",
        waitlist: "合格的申請人將按照「先申請先入住」的原則進入候補名單，直至候補名單額滿為止。",
        waitlistPreference: "住房優惠（如果適用）將影響候補名單的順序。",
        waitlistContact: "我們可能會在您進入候補名單時與您聯絡，確認您希望繼續留在候補名單上。",
      },
      interview: "如果我們聯絡您要求進行面談，您需要填寫更詳細的申請表並提供證明文件。",
    }

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
      eligible: {
        fcfs:
          "Những người nộp đơn hội đủ điều kiện sẽ được liên lạc trên cơ sở ai đến trước được phục vụ trước cho đến khi hết căn hộ trống.",
        fcfsPreference:
          "Các ưu tiên về nhà ở, nếu có, sẽ làm thay đổi thứ tự ai đến trước được phục vụ trước.",
        lottery:
          "Sau khi thời gian nộp đơn kết thúc, những người nộp đơn hội đủ điều kiện sẽ được sắp xếp theo thứ tự dựa trên xếp hạng rút thăm.",
        lotteryPreference:
          "Các ưu tiên về nhà ở, nếu có, sẽ làm thay đổi thứ tự xếp hạng rút thăm.",
        waitlist:
          "Những người nộp đơn hội đủ điều kiện sẽ được ghi tên vào danh sách chờ trên cơ sở ai đến trước được phục vụ trước cho đến khi các vị trí trong danh sách chờ được lấp đầy.",
        waitlistPreference:
          "Các ưu tiên về nhà ở, nếu có, sẽ làm thay đổi thứ tự trong danh sách chờ.Housing preferences, if applicable, will affect waitlist order.",
        waitlistContact:
          "Chúng tôi có thể liên lạc với quý vị khi quý vị đang ở trong danh sách chờ để xác nhận rằng quý vị muốn tiếp tục ở lại trong danh sách chờ.",
      },
      interview:
        "Nếu quý vị được mời tham gia phỏng vấn, quý vị sẽ được yêu cầu điền một đơn đăng ký chi tiết hơn và cung cấp các giấy tờ hỗ trợ cần thiết.",
    }

    await queryRunner.query(
      `UPDATE "translations" SET translations = ($1) where jurisdiction_id = ($2) and language = ($3)`,
      [sjVietnamese, sanJoseJurisdiction, Language.vi]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
