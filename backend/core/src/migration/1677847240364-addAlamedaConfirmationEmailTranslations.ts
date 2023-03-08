import {MigrationInterface, QueryRunner} from "typeorm";
import { Language } from "../shared/types/language-enum"

export class addAlamedaConfirmationEmailTranslations1677847240364 implements MigrationInterface {
    name = 'addAlamedaConfirmationEmailTranslations1677847240364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [{ id: alamedaJurisdiction }] = await queryRunner.query(
          `SELECT id FROM jurisdictions WHERE name = 'Alameda' LIMIT 1`
        )

        const alaSpanish = {
            confirmation: {
                gotYourConfirmationNumber: "Recibimos tu solicitud para:",
                yourConfirmationNumber: "Su número de confirmación",
                applicationReceived: "Aplicación <br />recibida",
                applicationsClosed: "Solicitud <br />cerrada",
                applicationsRanked: "Solicitud <br />clasificada",
                whatHappensNext: "¿Qué sucede luego?",
                needToMakeUpdates: "¿Necesita hacer modificaciones?",
                interview: "Si se comunican con usted para una entrevista, se le pedirá que complete una solicitud más detallada y presente documentos de respaldo.",
                eligible: {
                    waitlist: "Los solicitantes que reúnan los requisitos quedarán en la lista de espera por orden de recepción de solicitud hasta que se cubran todos los lugares.",
                    waitlistPreference: "Las preferencias de vivienda, si corresponde, afectarán al orden de la lista de espera.",
                    waitlistContact: "Es posible que se comuniquen con usted mientras esté en la lista de espera para confirmar que desea permanecer en la lista.",
                }
            },
            leasingAgent: {
                contactAgentToUpdateInfo: "Si necesita modificar información en su solicitud, no haga una solicitud nueva. Comuníquese con el agente de este listado.",
                propertyManager: "Administrador de propiedades",
                officeHours: "Horario de atención",
            },
            t: {
                seeListing: "VER EL LISTADO"
            },
            footer: {
                line1: "Alameda County Housing Portal es un proyecto del",
                line2: "Departamento de Vivienda y Desarrollo Comunitario (Housing and Community Development, HCD)"
            }
        };

        await queryRunner.query(
          `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
          [alamedaJurisdiction, Language.es, alaSpanish]
        )

        const alaVietnamese = {
            confirmation: {
                gotYourConfirmationNumber: "Chúng tôi đã nhận được đơn đăng ký của bạn cho",
                yourConfirmationNumber: "Số Xác Nhận Của Bạn",
                applicationReceived: "Đơn đăng ký <br />đã nhận được",
                applicationsClosed: "Đơn đăng ký <br />đã đóng",
                applicationsRanked: "Đơn đăng ký <br />được xếp hạng",
                whatHappensNext: "Điều gì diễn ra tiếp theo?",
                needToMakeUpdates: "Bạn cần cập nhật thông tin?",
                interview: "Nếu bạn được liên hệ để phỏng vấn, bạn sẽ được yêu cầu điền vào một đơn đăng ký chi tiết hơn và cung cấp các tài liệu hỗ trợ.",
                eligible: {
                    waitlist: "Những người đăng ký đủ điều kiện sẽ được đưa vào danh sách chờ trên cơ sở ai đăng ký trước sẽ được đưa vào trước cho đến khi hết chỗ trong danh sách chờ.",
                    waitlistPreference: "Ưu tiên về nhà ở, nếu áp dụng, sẽ ảnh hưởng đến thứ tự trong danh sách chờ.",
                    waitlistContact: "Bạn có thể được liên hệ khi đang ở danh sách chờ để xác nhận rằng bạn muốn tiếp tục ở danh sách chờ.",
                }
            },

            leasingAgent: {
                contactAgentToUpdateInfo: "Nếu bạn cần cập nhật thông tin trong đơn đăng ký, đừng đăng ký lại. Thay vào đó, hãy liên hệ với người đại diện để được cập nhật.",
                propertyManager: "Quản Lý Tài Sản",
                officeHours: "Giờ Làm Việc",
            },
            t: {
                seeListing: "XEM DANH SÁCH"
            },
            footer: {
                line1: "Cổng Thông Tin Nhà Ở Quận Alameda là một dự án của",
                line2: "Sở Phát Triển Cộng Đồng và Nhà Ở (HCD) Quận Alameda",
            }
        }

        await queryRunner.query(
          `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
          [alamedaJurisdiction, Language.vi, alaVietnamese]
        )

        const alaChinese =  {
            confirmation:{
            gotYourConfirmationNumber: "我們已收到您的申請",
            yourConfirmationNumber: "您的確認編號",
            applicationReceived: "已收到 <br />申請",
            applicationsClosed: "申請 <br />已結案",
            applicationsRanked: "申請 <br />等候中",
            whatHappensNext: "下一步是什麼？",
            needToMakeUpdates: "需要更新資料嗎？",
            interview: "如果聯絡您進行面談，則需要填寫更詳細的申請書並提供證明文件。",
            eligible: {
                waitlist: "符合資格的申請者將按照先到先處理的原則加入等候名單，直至等候名單額滿。",
                waitlistPreference: "申請者對住房的偏好（如適用）將影響等候名單的排序。",
                waitlistContact: "當您已列入等候名單時，我們可能聯絡您以確認您希望保留在等候名單上。",
            }
        },
            leasingAgent: {
                contactAgentToUpdateInfo: "如果需要，請更新申請資料，勿重新申請。若不需要，請聯絡本清單的代理。",
                propertyManager: "物業經理",
                officeHours: "辦公時間",
            },
            t: {
                seeListing: "查看名單",
            },
            footer: {
                line1: "阿拉米達縣住房入口網站",
                line2: "阿拉米達縣–住房及社區發展 (HCD) 部",
            },
        }

        await queryRunner.query(
          `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
          [alamedaJurisdiction, Language.zh, alaChinese]
        )

        const alaTaglog = {
            confirmation: {
                gotYourConfirmationNumber: "Natanggap namin ang iyong aplikasyon para sa",
                yourConfirmationNumber: "Ang Iyong Numero ng Kumpirmasyon",
                applicationReceived: "Aplikasyon <br />na natanggap",
                applicationsClosed: "Isinara <br /> na ang aplikasyon",
                applicationsRanked: "Na-rank <br />na aplikasyon",
                whatHappensNext: "Ano ang susunod na mangyayari?",
                needToMakeUpdates: "Kailangang gumawa ng mga update?",
                interview: "Kung ikaw ay kinontak para sa isang panayam, hihilingin sa iyong punan ang mas detalyadong aplikasyon at magbigay ng mga karagdagang dokumento.",
                eligible: {
                    waitlist: "Ang mga kwalipikadong aplikante ay ilalagay sa waitlist sa first come first serve basis hanggang sa mapunan ang mga puwesto sa waitlist.",
                    waitlistPreference: "Aga pagpipilian sa pabahay, kung naaangkop, ay makakaapekto sa pagkakasunod-sunod ng waitlist.",
                    waitlistContact: "Maaari kang kontakin habang nasa waitlist upang kumpirmahin na gusto mong manatili sa waitlist.",
                }
            },
            leasingAgent: {
                contactAgentToUpdateInfo: "Kung kailangan mong i-update ang iyong impormasyon sa aplikasyon, huwag nang mag-apply muli. Sa halip ay kontakin ang ahente para sa listahan na ito.",
                propertyManager: "Property Manager",
                officeHours: "Oras ng Opisina",
            },
            t: {
                seeListing: "TINGNAN ANG LISTAHAN",
            },
            footer: {
                line1: "Ang Alameda County Housing Portal ay isang proyekto ng",
                line2: "Alameda County – Departamento ng Housing and Community Development (HCD)",
            }
        }

        await queryRunner.query(
          `INSERT into "translations" (jurisdiction_id, language, translations) VALUES ($1, $2, $3)`,
          [alamedaJurisdiction, Language.tl, alaTaglog]
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}

}
