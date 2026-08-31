import { LanguagesEnum } from '@prisma/client';
import { TranslationRow } from '../utilities/translation-merge';

// The base email strings. Read at runtime as the layer beneath any database override, and used
// by the seed.
export const translations = (
  jurisdiction?: {
    id: string;
    name: string;
  },
  language?: LanguagesEnum,
) => {
  switch (language) {
    case LanguagesEnum.es:
      return {
        t: {
          hello: 'Hola',
          seeListing: 'VER EL LISTADO',
        },
        footer: {
          line1: 'Bloom',
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
            waitlistContactAdvocate:
              'Es posible que nos comuniquemos con su cliente mientras esté en la lista de espera para confirmar que desea permanecer en la lista de espera.',
          },
          interview:
            'Si se comunican con usted para una entrevista, se le pedirá que complete una solicitud más detallada y presente documentos de respaldo.',
          interviewAdvocate:
            'Si contactamos a su cliente para una entrevista, se le pedirá que complete una solicitud más detallada y proporcione documentos de respaldo.',
          whatHappensNext: '¿Qué sucede luego?',
          questions: '¿Preguntas?',
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
          contactAgentForQuestions:
            'Si tiene preguntas sobre esta aplicación, comuníquese con el agente de este listado.',
        },
        lotteryAvailable: {
          duplicatesDetails:
            'Bloom generalmente no acepta solicitudes duplicadas. Una solicitud duplicada es aquella en la que aparece una persona que también aparece en otra solicitud para la misma oportunidad de vivienda. Para obtener información más detallada sobre cómo manejamos las solicitudes duplicadas, consulte nuestros',
          header: 'Nuevos resultados de la lotería de vivienda disponibles',
          otherOpportunities1:
            'Para ver otras oportunidades de vivienda, visite %{appUrl}. Puede registrarse para recibir notificaciones de nuevas oportunidades de solicitud',
          otherOpportunities2: 'aquí',
          otherOpportunities3:
            'Si desea obtener información sobre cómo funcionan las loterías, consulte la sección de lotería del',
          otherOpportunities4: 'Housing Portal Centro de ayuda',
          resultsAvailable:
            'Los resultados están disponibles para una lotería de vivienda para %{listingName}. Consulte su cuenta del portal de vivienda para obtener más información.',
          signIn: 'Inicie sesión para ver sus resultados',
          termsOfUse: 'Términos de uso',
          whatHappensHeader: '¿Qué pasa después?',
          whatHappensContent:
            'El administrador de la propiedad comenzará a comunicarse con los solicitantes en el orden de clasificación de la lotería, dentro de cada preferencia de la lotería. Cuando todas las unidades estén ocupadas, el administrador de la propiedad dejará de comunicarse con los solicitantes. Es posible que todas las unidades estén ocupadas antes de que el administrador de la propiedad alcance su clasificación. Si esto sucede, no se comunicarán con usted.',
          termsUrl: 'https://www.exygy.com',
          helpCenterUrl: 'https://www.exygy.com',
          notificationsUrl: 'https://www.exygy.com',
        },
        accountRemoval: {
          subject:
            'Eliminación programada de cuenta de Bloom Housing debido a inactividad',
          courtesyText1:
            'Este es un mensaje de cortesía para informarle que, debido a que su cuenta del portal Bloom Housing ha estado inactiva durante 3 años, se eliminará en un plazo de 30 días conforme a nuestra',
          courtesyText2:
            'Si desea conservar su cuenta, por favor inicie sesión en cualquier momento durante el próximo mes y la consideraremos nuevamente activa.',
          signIn: 'Iniciar sesión en Bloom Housing',
          privacyPolicy: 'Política de privacidad',
          privacyPolicyUrl: 'localhost:3000/privacy-policy',
        },
        register: {
          welcome: 'Bienvenido',
          welcomeMessage:
            'Gracias por crear su cuenta en %{appUrl}. Ahora le resultará más fácil iniciar, guardar y enviar solicitudes en línea para los anuncios que aparecen en el sitio.',
          confirmMyAccount: 'Confirmar mi cuenta',
          toConfirmAccountMessage:
            'Para completar la creación de su cuenta, haga clic en el siguiente enlace:',
        },
        applicationUpdate: {
          subject: 'Actualización de la aplicación para %{listingName}',
          title: 'Su aplicación ha sido actualizada para %{listingName}',
          greeting: 'Hola',
          updateNotice:
            'Se ha realizado una actualización en su solicitud de vivienda para %{listingName}.',
          advocateUpdateNotice:
            'Se ha realizado una actualización a la solicitud de vivienda que envió en nombre de %{applicantName} para %{listingName}.',
          summaryTitle: 'Resumen de cambios:',
          statusChange:
            'El estado de su solicitud ha cambiado de %{from} a %{to}',
          declineReasonChange:
            'El motivo del rechazo de su solicitud es %{value}',
          accessibleWaitListChange:
            'Su número de lista de espera accesible es %{value}',
          conventionalWaitListChange:
            'Su número de lista de espera convencional es %{value}',
          statusLabel: 'Estado de la solicitud',
          contactNotice:
            'No se requiere ninguna acción adicional en este momento. Si tiene alguna pregunta sobre esta actualización, comuníquese con nosotros en',
          applicantContactNotice:
            'Si tiene preguntas sobre esta actualización, comuníquese con nosotros en',
          viewPrompt:
            'Para ver su solicitud, haga clic en el siguiente enlace:',
          viewLink: 'Ver mi solicitud',
          advocateViewPrompt:
            'Para ver la solicitud de su cliente, haga clic en el siguiente enlace:',
          advocateViewLink: 'Ver aplicación',
          applicationStatus: {
            submitted: 'Enviada',
            declined: 'Rechazada',
            receivedUnit: 'Unidad recibida',
            waitlist: 'Lista de espera',
            waitlistDeclined: 'Lista de espera - Rechazada',
          },
          declineReason: {
            householdIncomeTooHigh:
              'Los ingresos familiares son demasiado altos.',
            householdIncomeTooLow:
              'Los ingresos familiares son demasiado bajos.',
            householdSizeTooLarge:
              'El tamaño de la vivienda es demasiado grande.',
            householdSizeTooSmall:
              'El tamaño de la vivienda es demasiado pequeño',
            attemptedToContactNoResponse:
              'Se intentó contactar; no hubo respuesta.',
            applicantDeclinedUnit: 'El solicitante rechazó la unidad.',
            doesNotMeetSeniorBuildingRequirement:
              'No cumple con los requisitos del edificio para personas mayores',
            householdDoesNotNeedAccessibleUnit:
              'El hogar no necesita características de accesibilidad en la unidad.',
            other: 'Otro',
          },
        },
        applicationBulk: {
          viewApplications: 'Ver solicitudes',
          success: {
            subject:
              'Su actualización masiva de solicitudes para %{listingName} se ha completado',
            message: 'Su actualización masiva se ha procesado correctamente.',
            count: 'Se actualizaron %{updateCount} registros de solicitudes.',
          },
          successWithError: {
            subject:
              'Su actualización masiva de solicitudes para %{listingName} se ha completado',
            message:
              'Su actualización masiva se ha procesado correctamente. Sin embargo, no se pudieron enviar %{failedEmailsCount} correo(s) de notificación a los solicitantes.',
            errors:
              'Se actualizaron %{updateCount} registros de solicitudes. Comuníquese con su equipo técnico para conocer los próximos pasos para resolver las notificaciones.',
          },
          failure: {
            subject:
              'No se pudo completar su actualización masiva de solicitudes para %{listingName}',
            message:
              'Su actualización masiva encontró un error y no se pudo completar.',
            help: 'Los registros anteriores a la fila con error se han actualizado. Si volver a cargar el archivo no soluciona el problema, comuníquese con el equipo de soporte.',
          },
        },
        advocateApproved: {
          subject: 'Su cuenta ha sido aprobada',
          hello: 'Hola',
          approvalMessage: 'Su cuenta en %{appUrl} ha sido aprobada.',
          approvalInfo:
            'Ahora le resultará más fácil iniciar, guardar y enviar solicitudes en línea <strong>en nombre de solicitantes de vivienda</strong> para los listados que aparecen en el sitio.',
          completeMessage:
            'Para completar la creación de su cuenta, haga clic en el siguiente enlace:',
          createAccount: 'Crear mi cuenta',
        },
        advocateRejected: {
          subject: 'Actualización sobre su solicitud de cuenta',
          hello: 'Hola',
          rejectionMessageStart:
            'Gracias por su interés en crear una cuenta en %{appUrl}.',
          rejectionMessageEnd: 'No podemos aprobar su cuenta en este momento.',
          rejectionInfoStart:
            'Si cree que esta decisión fue un error o tiene preguntas sobre la elegibilidad, comuníquese con nosotros en',
          rejectionInfoEnd: 'para obtener más información.',
        },
        forgotPassword: {
          subject: '¿Restablecer su contraseña?',
          resetRequest:
            'Recibimos una solicitud para restablecer la contraseña de su cuenta del Portal de Vivienda Bloom. Debe hacer clic en el siguiente enlace para completar el restablecimiento:',
          ignoreRequest:
            'Este restablecimiento de contraseña solo es válido durante la próxima hora. Si usted no hizo esta solicitud, ignore este correo electrónico.',
          changePassword: 'Cambiar mi contraseña',
        },
        rentalOpportunity: {
          subject: 'Nueva oportunidad de alquiler en %{listingName}',
          intro: 'Oportunidad de alquiler en',
          comingSoon: {
            subject: 'Próximamente - %{listingName}',
            intro: 'Próximamente',
          },
          community: 'Comunidad',
          communityType: {
            developmentalDisability: 'La discapacidad del desarrollo',
            farmworkerHousing: 'Vivienda para trabajadores agrícolas',
            housingVoucher: 'Vale HCV/Sección 8',
            referralOnly: 'Sólo por referencia',
            schoolEmployee: 'Empleado de la escuela',
            senior: 'Personas mayores',
            senior55: 'Personas mayores de 55 años',
            senior62: 'Personas mayores de 62 años',
            specialNeeds: 'Necesidades especiales',
            tay: 'TAY - Jóvenes en edad de transición',
            veteran: 'Veterano',
          },
          applicationsDue: 'Fecha límite de solicitudes',
          applicationsOpen: 'Apertura de solicitudes',
          address: 'Dirección',
          neighborhood: 'Vecindario',
          region: 'Región',
          unitType: 'Unidades accesibles disponibles',
          accessibilityType: {
            hearing: 'Auditiva',
            mobility: 'Movilidad',
            vision: 'Visual',
            hearingAndVision: 'Auditiva/visual',
            mobilityAndHearing: 'Movilidad y auditiva',
            mobilityAndVision: 'Movilidad y visual',
            mobilityHearingAndVision: 'Movilidad y auditiva/visual',
          },
          opportunityType: 'Tipo de oportunidad',
          lottery: 'Lotería',
          waitlist: 'Lista de espera',
          unitTypes: {
            SRO: 'SRO',
            studio: 'Estudio',
            oneBdrm: '1 dormitorio',
            twoBdrm: '2 dormitorios',
            threeBdrm: '3 dormitorios',
            fourBdrm: '4 dormitorios',
            fiveBdrm: '5 dormitorios',
          },
          unitCount: '%{smart_count} unidad |||| %{smart_count} unidades',
          bathCount: '%{smart_count} baño |||| %{smart_count} baños',
          rent: 'Renta',
          sqft: 'pies²',
          minIncome: 'Ingreso mínimo',
          maxIncome: 'Ingreso máximo',
          perMonth: 'por mes',
          ofIncome: 'de ingresos',
          orUpTo: 'o hasta',
          lotteryDate: 'Fecha de lotería',
          viewListingNotice: {
            line1: 'ESTA INFORMACIÓN PUEDE CAMBIAR',
            line2:
              'Por favor, consulte el anuncio para obtener la información más actualizada',
          },
          viewButton: {
            en: 'View listing & apply',
            es: 'Ver listado y aplicar',
            zh: '查看列表并申请',
            vi: 'Xem danh sách và áp dụng',
            tl: 'Tingnan ang listahan at mag-apply',
            bn: 'তালিকা দেখুন এবং আবেদন করুন',
            ar: 'عرض القائمة والتقديم',
            fa: 'مشاهده لیست و اعمال',
            hy: 'Դիտեք ցուցակը և կիրառեք',
            ko: '목록 보기 및 신청',
          },
          footer: {
            accessibleMarketingFlyer: 'Volante de marketing accesible',
            unsubscribeAndEmailSettings:
              'Cancelar suscripción y gestionar configuración de correo electrónico',
          },
        },
      };
    case LanguagesEnum.vi:
      return {
        applicationBulk: {
          viewApplications: 'Xem đơn đăng ký',
          success: {
            subject:
              'Cập nhật hàng loạt đơn đăng ký của bạn cho %{listingName} đã hoàn tất',
            message: 'Cập nhật hàng loạt của bạn đã được xử lý thành công.',
            count: 'Đã cập nhật %{updateCount} hồ sơ đơn đăng ký.',
          },
          successWithError: {
            subject:
              'Cập nhật hàng loạt đơn đăng ký của bạn cho %{listingName} đã hoàn tất',
            message:
              'Cập nhật hàng loạt của bạn đã được xử lý thành công. Tuy nhiên, không thể gửi %{failedEmailsCount} email thông báo cho người nộp đơn.',
            errors:
              'Đã cập nhật %{updateCount} hồ sơ đơn đăng ký. Vui lòng liên hệ với nhóm kỹ thuật của bạn để biết các bước tiếp theo về việc xử lý thông báo.',
          },
          failure: {
            subject:
              'Không thể hoàn tất cập nhật hàng loạt đơn đăng ký của bạn cho %{listingName}',
            message:
              'Cập nhật hàng loạt của bạn gặp lỗi và không thể hoàn tất.',
            help: 'Các hồ sơ trước dòng bị lỗi đã được cập nhật. Nếu tải lại tệp của bạn không khắc phục được sự cố, vui lòng liên hệ với nhóm hỗ trợ.',
          },
        },
        advocateApproved: {
          subject: 'Tài khoản của bạn đã được phê duyệt',
          hello: 'Xin chào',
          approvalMessage: 'Tài khoản của bạn tại %{appUrl} đã được phê duyệt.',
          approvalInfo:
            'Giờ đây sẽ dễ dàng hơn để bạn bắt đầu, lưu và gửi các ứng dụng trực tuyến <strong>thay mặt cho các ứng viên nhà ở</strong> cho các danh sách xuất hiện trên trang web.',
          completeMessage:
            'Để hoàn thành việc tạo tài khoản của bạn, vui lòng nhấp vào liên kết dưới đây:',
          createAccount: 'Tạo tài khoản của tôi',
        },
        advocateRejected: {
          subject: 'Cập nhật về yêu cầu tài khoản của bạn',
          hello: 'Xin chào',
          rejectionMessageStart:
            'Cảm ơn bạn đã quan tâm đến việc tạo tài khoản trên %{appUrl}.',
          rejectionMessageEnd:
            'Chúng tôi không thể phê duyệt tài khoản của bạn vào lúc này.',
          rejectionInfoStart:
            'Nếu bạn tin rằng quyết định này được đưa ra do sai sót hoặc có câu hỏi về đủ điều kiện, vui lòng liên hệ với chúng tôi tại',
          rejectionInfoEnd: 'để biết thêm thông tin.',
        },
        forgotPassword: {
          subject: 'Đặt lại mật khẩu của bạn?',
          resetRequest:
            'Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản Cổng thông tin Nhà ở Bloom của bạn. Bạn phải nhấp vào liên kết sau để hoàn tất việc đặt lại:',
          ignoreRequest:
            'Việc đặt lại mật khẩu này chỉ có hiệu lực trong một giờ tới. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.',
          changePassword: 'Thay đổi mật khẩu của tôi',
        },
        rentalOpportunity: {
          subject: 'Cơ hội thuê nhà mới tại %{listingName}',
          intro: 'Cơ hội thuê nhà tại',
          comingSoon: {
            subject: 'Sắp ra mắt - %{listingName}',
            intro: 'Sắp ra mắt',
          },
          community: 'Cộng đồng',
          communityType: {
            developmentalDisability: 'Khuyết tật phát triển',
            farmworkerHousing: 'Nhà ở cho công nhân nông trại',
            housingVoucher: 'Phiếu HCV/Phần 8',
            referralOnly: 'Chỉ giới thiệu',
            schoolEmployee: 'Nhân viên trường học',
            senior: 'Người lớn tuổi',
            senior55: 'Người cao tuổi 55+',
            senior62: 'Người cao tuổi 62+',
            specialNeeds: 'Nhu cầu đặc biệt',
            tay: 'TAY - Thanh thiếu niên trong độ tuổi chuyển tiếp',
            veteran: 'Cựu chiến binh',
          },
          applicationsDue: 'Hạn nộp đơn',
          applicationsOpen: 'Ngày bắt đầu nhận đơn',
          address: 'Địa chỉ',
          neighborhood: 'Khu phố',
          region: 'Vùng đất',
          unitType: 'Các căn hộ có sẵn',
          accessibilityType: {
            hearing: 'Thính giác',
            mobility: 'Di chuyển',
            vision: 'Thị giác',
            hearingAndVision: 'Thính giác / thị giác',
            mobilityAndHearing: 'Di chuyển và thính giác',
            mobilityAndVision: 'Di chuyển và thị giác',
            mobilityHearingAndVision: 'Di chuyển và thính giác/thị giác',
          },
          opportunityType: 'Loại cơ hội',
          lottery: 'Xổ số',
          waitlist: 'Danh sách chờ',
          unitTypes: {
            SRO: 'SRO',
            studio: 'Studio',
            oneBdrm: '1 phòng ngủ',
            twoBdrm: '2 phòng ngủ',
            threeBdrm: '3 phòng ngủ',
            fourBdrm: '4 phòng ngủ',
            fiveBdrm: '5 phòng ngủ',
          },
          unitCount: '%{smart_count} căn hộ |||| %{smart_count} căn hộ',
          bathCount: '%{smart_count} phòng tắm |||| %{smart_count} phòng tắm',
          rent: 'Tiền thuê',
          sqft: 'feet²',
          minIncome: 'Thu nhập tối thiểu',
          maxIncome: 'Thu nhập tối đa',
          perMonth: 'mỗi tháng',
          ofIncome: 'thu nhập',
          orUpTo: 'hoặc lên đến',
          lotteryDate: 'Ngày xổ số',
          viewListingNotice: {
            line1: 'THÔNG TIN NÀY CÓ THỂ THAY ĐỔI',
            line2: 'Vui lòng xem danh sách để biết thông tin cập nhật nhất',
          },
          viewButton: {
            en: 'View listing & apply',
            es: 'Ver listado y aplicar',
            zh: '查看列表并申请',
            vi: 'Xem danh sách và áp dụng',
            tl: 'Tingnan ang listahan at mag-apply',
            bn: 'তালিকা দেখুন এবং আবেদন করুন',
            ar: 'عرض القائمة والتقديم',
            fa: 'مشاهده لیست و اعمال',
            hy: 'Դիտեք ցուցակը և կիրառեք',
            ko: '목록 보기 및 신청',
          },
          footer: {
            accessibleMarketingFlyer: 'Tờ rơi tiếp thị có thể truy cập',
            unsubscribeAndEmailSettings: 'Hủy đăng ký và quản lý cài đặt email',
          },
        },
        accountRemoval: {
          signIn: 'Đăng nhập vào Bloom Housing',
          subject: 'Bloom Housing đã lên lịch xóa tài khoản do không hoạt động',
          courtesyText1:
            'Đây là một email thông báo rằng vì tài khoản Bloom Housing Portal của bạn đã không hoạt động trong 3 năm, tài khoản của bạn sẽ bị xóa trong vòng 30 ngày theo chính sách của chúng tôi.',
          courtesyText2:
            'Nếu bạn muốn giữ tài khoản của mình, vui lòng đăng nhập bất cứ lúc nào trong tháng tới và chúng tôi sẽ coi tài khoản của bạn là hoạt động trở lại.',
          privacyPolicy: 'Chính sách bảo mật',
          privacyPolicyUrl: 'localhost:3000/privacy-policy',
        },
        lotteryAvailable: {
          termsUrl: 'https://www.exygy.com',
          termsOfUse: 'Điều khoản sử dụng',
          helpCenterUrl: 'https://www.exygy.com',
          notificationsUrl: 'https://www.exygy.com',
          duplicatesDetails:
            'Bloom thường không chấp nhận các đơn xin trùng lặp. Một đơn xin trùng lặp là đơn xin có người cũng xuất hiện trên một đơn xin khác cho cùng một cơ hội nhà ở. Để biết thông tin chi tiết hơn về cách chúng tôi xử lý các đơn xin trùng lặp, hãy xem của chúng tôi',
        },
        applicationUpdate: {
          title: 'Ứng dụng của bạn đã được cập nhật cho %{listingName}',
          subject: 'Cập nhật ứng dụng cho %{listingName}',
          greeting: 'Xin chào',
          viewLink: 'Xem đơn đăng ký của tôi',
          viewPrompt:
            'Để xem hồ sơ ứng tuyển của bạn, vui lòng nhấp vào liên kết bên dưới:',
          statusLabel: 'Trạng thái ứng dụng',
          statusChange:
            'Trạng thái hồ sơ của bạn đã thay đổi từ %{from} thành %{to}',
          summaryTitle: 'Tóm tắt các thay đổi:',
          updateNotice:
            'Đã có bản cập nhật cho đơn đăng ký nhà ở của bạn tại %{listingName}.',
          contactNotice:
            'Hiện tại không cần thực hiện thêm bất kỳ hành động nào. Nếu bạn có thắc mắc về bản cập nhật này, vui lòng liên hệ theo địa chỉ sau:',
          declineReason: {
            other: 'Khác',
            applicantDeclinedUnit: 'Người nộp đơn đã từ chối căn hộ.',
            householdIncomeTooLow: 'Thu nhập hộ gia đình quá thấp',
            householdSizeTooLarge: 'Quy mô hộ gia đình quá lớn',
            householdSizeTooSmall: 'Quy mô hộ gia đình quá nhỏ',
            householdIncomeTooHigh: 'Thu nhập hộ gia đình quá cao',
            attemptedToContactNoResponse:
              'Đã cố gắng liên lạc; không nhận được phản hồi.',
            householdDoesNotNeedAccessibleUnit:
              'Hộ gia đình không cần các tiện nghi dành cho người khuyết tật.',
            doesNotMeetSeniorBuildingRequirement:
              'Không đáp ứng yêu cầu của tòa nhà dành cho người cao tuổi.',
          },
          advocateViewLink: 'Xem ứng dụng',
          applicationStatus: {
            declined: 'Đã từ chối',
            waitlist: 'Danh sách chờ',
            submitted: 'Đã gửi',
            receivedUnit: 'Đã nhận đơn vị',
            waitlistDeclined: 'Danh sách chờ - Đã từ chối',
          },
          advocateViewPrompt:
            'Để xem hồ sơ ứng tuyển của khách hàng, vui lòng nhấp vào liên kết bên dưới:',
          declineReasonChange: 'Lý do từ chối đơn đăng ký của bạn là %{value}',
          advocateUpdateNotice:
            'Đã có bản cập nhật cho đơn xin nhà ở mà bạn đã nộp thay mặt cho %{applicantName} tại %{listingName}.',
          applicantContactNotice:
            'Nếu bạn có thắc mắc về bản cập nhật này, vui lòng liên hệ theo địa chỉ sau:',
          accessibleWaitListChange:
            'Số thứ tự trong danh sách chờ dành cho người khuyết tật của bạn là %{value}',
          conventionalWaitListChange:
            'Số thứ tự trong danh sách chờ thông thường của bạn là %{value}',
        },
      };
    case LanguagesEnum.zh:
      return {
        applicationBulk: {
          viewApplications: '查看申请',
          success: {
            subject: '您针对 %{listingName} 的批量申请更新已完成',
            message: '您的批量更新已成功处理。',
            count: '已更新 %{updateCount} 条申请记录。',
          },
          successWithError: {
            subject: '您针对 %{listingName} 的批量申请更新已完成',
            message:
              '您的批量更新已成功处理。但是，有 %{failedEmailsCount} 封申请人通知电子邮件无法发送。',
            errors:
              '已更新 %{updateCount} 条申请记录。请联系您的技术团队，了解解决通知问题的后续步骤。',
          },
          failure: {
            subject: '您针对 %{listingName} 的批量申请更新无法完成',
            message: '您的批量更新遇到错误，无法完成。',
            help: '失败行之前的记录已更新。如果重新上传文件仍无法解决问题，请联系支持团队。',
          },
        },
        advocateApproved: {
          subject: '您的账户已被批准',
          hello: '您好',
          approvalMessage: '您在 %{appUrl} 的账户已被批准。',
          approvalInfo:
            '现在您可以更轻松地代表住房申请人开始、保存和提交在线申请，申请针对网站上显示的列表。',
          completeMessage: '要完成您的账户创建，请点击下面的链接：',
          createAccount: '创建我的账户',
        },
        advocateRejected: {
          subject: '关于您的账户申请的更新',
          hello: '您好',
          rejectionMessageStart: '感谢您对在 %{appUrl} 创建账户的兴趣。',
          rejectionMessageEnd: '我们目前无法批准您的账户。',
          rejectionInfoStart:
            '如果您认为这个决定是错误的或对资格有疑问，请通过以下方式与我们联系',
          rejectionInfoEnd: '获取更多信息。',
        },
        forgotPassword: {
          subject: '重置您的密码？',
          resetRequest:
            '我们收到了重置您的 Bloom 住房门户账户密码的请求。您必须点击以下链接才能完成重置：',
          ignoreRequest:
            '此密码重置仅在接下来的一小时内有效。如果您没有提出此请求，请忽略此电子邮件。',
          changePassword: '更改我的密码',
        },
        rentalOpportunity: {
          subject: '新租赁机会：%{listingName}',
          intro: '租赁机会，地点：',
          comingSoon: {
            subject: '即将推出 - %{listingName}',
            intro: '即将推出',
          },
          community: '社区',
          communityType: {
            developmentalDisability: '发育障碍',
            farmworkerHousing: '移工住房',
            housingVoucher: 'HCV/第 8 节优惠券',
            referralOnly: '仅限推荐人',
            schoolEmployee: '學校員工',
            senior: '老年人',
            senior55: '55 岁以上的老年人',
            senior62: '62 岁以上的老年人',
            specialNeeds: '特殊需求',
            tay: 'TAY - 過渡年齡青年',
            veteran: '老將',
          },
          applicationsDue: '申请截止日期',
          applicationsOpen: '申请开放日期',
          address: '地址',
          neighborhood: '街区',
          region: '地区',
          unitType: '可用的无障碍单元',
          accessibilityType: {
            hearing: '听力',
            mobility: '行动',
            vision: '视力',
            hearingAndVision: '听力/视力',
            mobilityAndHearing: '行动和听力',
            mobilityAndVision: '行动和视力',
            mobilityHearingAndVision: '行动和听力/视力',
          },
          opportunityType: '机会类型',
          lottery: '抽签',
          waitlist: '候补名单',
          unitTypes: {
            SRO: 'SRO',
            studio: '开间',
            oneBdrm: '1间卧室',
            twoBdrm: '2间卧室',
            threeBdrm: '3间卧室',
            fourBdrm: '4间卧室',
            fiveBdrm: '5间卧室',
          },
          unitCount: '%{smart_count} 个单元 |||| %{smart_count} 个单元',
          bathCount: '%{smart_count} 间浴室 |||| %{smart_count} 间浴室',
          rent: '租金',
          sqft: '平方英尺',
          minIncome: '最低收入',
          maxIncome: '最高收入',
          perMonth: '每月',
          ofIncome: '收入',
          orUpTo: '或最多',
          lotteryDate: '抽签日期',
          viewListingNotice: {
            line1: '此信息可能会更改',
            line2: '请查看列表以获取最新信息',
          },
          viewButton: {
            en: 'View listing & apply',
            es: 'Ver listado y aplicar',
            zh: '查看列表并申请',
            vi: 'Xem danh sách và áp dụng',
            tl: 'Tingnan ang listahan at mag-apply',
            bn: 'তালিকা দেখুন এবং আবেদন করুন',
            ar: 'عرض القائمة والتقديم',
            fa: 'مشاهده لیست و اعمال',
            hy: 'Դիտեք ցուցակը և կիրառեք',
            ko: '목록 보기 및 신청',
          },
          footer: {
            accessibleMarketingFlyer: '无障碍营销传单',
            unsubscribeAndEmailSettings: '取消订阅并管理电子邮件设置',
          },
        },
        accountRemoval: {
          signIn: '登入 Bloom Housing',
          subject: 'Bloom Housing 因帳戶長期不活躍，計劃刪除您的帳戶',
          courtesyText1:
            '這是一封禮貌性郵件，通知您由於您的 Bloom Housing Portal 帳戶已閒置 3 年，根據我們的政策，您的帳戶將在 30 天後被刪除。',
          courtesyText2:
            '如果您想保留您的帳戶，請在下個月內隨時登錄，我們將視您的帳戶為已重新啟用。',
          privacyPolicy: '隱私權政策',
          privacyPolicyUrl: 'localhost:3000/privacy-policy',
        },
        lotteryAvailable: {
          termsUrl: 'https://www.exygy.com',
          termsOfUse: '使用条款',
          helpCenterUrl: 'https://www.exygy.com',
          notificationsUrl: 'https://www.exygy.com',
          duplicatesDetails:
            'Bloom 一般不接受重复申请。重复申请是指申请者与另一份申请者有相同的住房机会。有关我们如何处理重复申请的更多详细信息，请参阅我们的',
        },
        applicationUpdate: {
          title: '您的申请已更新至 %{listingName}',
          subject: '%{listingName} 的应用程序更新',
          greeting: '你好',
          viewLink: '查看我的申请',
          viewPrompt: '要查看您的申请，请点击以下链接：',
          statusLabel: '应用程序状态',
          statusChange: '您的申请状态已从 %{from} 更改为 %{to}',
          summaryTitle: '变更摘要：',
          updateNotice: '您的房屋申请（房源名称：%{listingName}）已更新。',
          contactNotice:
            '目前无需采取任何进一步行动。如果您对此更新有任何疑问，请联系我们。',
          declineReason: {
            other: '其他',
            applicantDeclinedUnit: '申请人拒绝了该单元',
            householdIncomeTooLow: '家庭收入过低',
            householdSizeTooLarge: '家庭规模过大',
            householdSizeTooSmall: '家庭规模太小',
            householdIncomeTooHigh: '家庭收入过高',
            attemptedToContactNoResponse: '尝试联系，但未收到回复',
            householdDoesNotNeedAccessibleUnit: '家庭不需要无障碍单元功能',
            doesNotMeetSeniorBuildingRequirement: '不符合高级建筑要求',
          },
          advocateViewLink: '查看应用程序',
          applicationStatus: {
            declined: '已拒絕',
            waitlist: '候補名單',
            submitted: '已提交',
            receivedUnit: '已獲配單位',
            waitlistDeclined: '候補名單 - 已拒絕',
          },
          advocateViewPrompt: '要查看您客户的申请，请点击以下链接：',
          declineReasonChange: '您的申请被拒原因是 %{value}',
          advocateUpdateNotice:
            '您代表 %{applicantName} 提交的关于 %{listingName} 的住房申请已更新。',
          applicantContactNotice: '如果您对本次更新有任何疑问，请联系我们。',
          accessibleWaitListChange: '您的无障碍候补名单编号为 %{value}',
          conventionalWaitListChange: '您的常规候补名单编号为 %{value}',
        },
      };
    case LanguagesEnum.tl:
      return {
        applicationBulk: {
          viewApplications: 'Tingnan ang mga Aplikasyon',
          success: {
            subject:
              'Kumpleto na ang iyong bulk na pag-update ng aplikasyon para sa %{listingName}',
            message: 'Matagumpay na naproseso ang iyong bulk na pag-update.',
            count: '%{updateCount} na talaan ng aplikasyon ang na-update.',
          },
          successWithError: {
            subject:
              'Kumpleto na ang iyong bulk na pag-update ng aplikasyon para sa %{listingName}',
            message:
              'Matagumpay na naproseso ang iyong bulk na pag-update. Gayunpaman, %{failedEmailsCount} na email ng abiso sa aplikante ang hindi naipadala.',
            errors:
              '%{updateCount} na talaan ng aplikasyon ang na-update. Mangyaring makipag-ugnayan sa iyong teknikal na koponan para sa mga susunod na hakbang sa paglutas ng mga abiso.',
          },
          failure: {
            subject:
              'Hindi makumpleto ang iyong bulk na pag-update ng aplikasyon para sa %{listingName}',
            message:
              'Nakaranas ng error ang iyong bulk na pag-update at hindi ito makumpleto.',
            help: 'Ang mga talaan bago ang row na nabigo ay na-update na. Kung hindi maaayos ng muling pag-upload ng iyong file ang isyu, mangyaring makipag-ugnayan sa support team.',
          },
        },
        advocateApproved: {
          subject: 'Ang iyong account ay na-apruba na',
          hello: 'Kamusta',
          approvalMessage: 'Ang iyong account sa %{appUrl} ay na-apruba na.',
          approvalInfo:
            'Mas magiging madali na para sa iyo na magsimula, magsave, at magsumite ng online applications <strong>para sa mgap housing applicants</strong> para sa mga listings na lumalabas sa site.',
          completeMessage:
            'Upang makumpleto ang iyong account creation, mangyaring i-click ang link sa ibaba:',
          createAccount: 'Lumikha ng aking account',
        },
        advocateRejected: {
          subject: 'Update tungkol sa iyong account request',
          hello: 'Kamusta',
          rejectionMessageStart:
            'Salamat sa iyong interes na lumikha ng account sa %{appUrl}.',
          rejectionMessageEnd:
            'Hindi kami makakabigay ng approval sa iyong account sa ngayon.',
          rejectionInfoStart:
            'Kung naniniwala ka na ang desisyon na ito ay nagawa sa error o mayroon kang mga tanong tungkol sa eligibility, mangyaring makipag-ugnayan sa amin sa',
          rejectionInfoEnd: 'para sa higit pang impormasyon.',
        },
        forgotPassword: {
          subject: 'I-reset ang iyong password?',
          resetRequest:
            'Nakatanggap kami ng kahilingan na i-reset ang password ng iyong account sa Bloom Housing Portal. Kailangan mong i-click ang sumusunod na link upang makumpleto ang pag-reset:',
          ignoreRequest:
            'Ang pag-reset ng password na ito ay may bisa lamang sa loob ng susunod na isang oras. Kung hindi ikaw ang gumawa ng kahilingang ito, mangyaring huwag pansinin ang email na ito.',
          changePassword: 'Baguhin ang aking password',
        },
        rentalOpportunity: {
          subject: 'Bagong pagkakataon sa pag-upa sa %{listingName}',
          intro: 'Pagkakataon sa pag-upa sa',
          comingSoon: {
            subject: 'Malapit na - %{listingName}',
            intro: 'Malapit na',
          },
          community: 'Komunidad',
          communityType: {
            developmentalDisability: 'Kapansanan sa pag-unlad',
            farmworkerHousing: 'Pabahay ng manggagawang bukid',
            housingVoucher: 'Voucher ng HCV/Seksyon 8',
            referralOnly: 'Referral lamang',
            schoolEmployee: 'Empleyado ng paaralan',
            senior: 'Mga nakatatanda',
            senior55: 'Mga nakatatanda 55+',
            senior62: 'Mga nakatatanda 62+',
            specialNeeds: 'Espesyal na pangangailangan',
            tay: 'TAY - Transition aged youth',
            veteran: 'Beterano',
          },
          applicationsDue: 'Deadline ng Aplikasyon',
          applicationsOpen: 'Pagbubukas ng Aplikasyon',
          address: 'Address',
          neighborhood: 'Kapitbahayan',
          region: 'Rehiyon',
          unitType: 'Mga available na accessible unit',
          accessibilityType: {
            hearing: 'Pandinig',
            mobility: 'Mobilidad',
            vision: 'Paningin',
            hearingAndVision: 'Pandinig/paningin',
            mobilityAndHearing: 'Mobilidad at pandinig',
            mobilityAndVision: 'Mobilidad at paningin',
            mobilityHearingAndVision: 'Mobilidad at pandinig/paningin',
          },
          opportunityType: 'Uri ng pagkakataon',
          lottery: 'Lottery',
          waitlist: 'Listahan ng paghihintay',
          unitTypes: {
            SRO: 'SRO',
            studio: 'Studio',
            oneBdrm: '1 silid-tulugan',
            twoBdrm: '2 silid-tulugan',
            threeBdrm: '3 silid-tulugan',
            fourBdrm: '4 silid-tulugan',
            fiveBdrm: '5 silid-tulugan',
          },
          unitCount: '%{smart_count} unit |||| %{smart_count} mga unit',
          bathCount: '%{smart_count} banyo |||| %{smart_count} mga banyo',
          rent: 'Upa',
          sqft: 'sq ft',
          minIncome: 'Pinakamababang Kita',
          maxIncome: 'Pinakamataas na Kita',
          perMonth: 'bawat buwan',
          ofIncome: 'ng kita',
          orUpTo: 'o hanggang sa',
          lotteryDate: 'Petsa ng Lottery',
          viewListingNotice: {
            line1: 'ANG IMPORMASYONG ITO AY MAAARING MAGBAGO',
            line2:
              'Pakitingnan ang listahan para sa pinaka-updated na impormasyon',
          },
          viewButton: {
            en: 'View listing & apply',
            es: 'Ver listado y aplicar',
            zh: '查看列表并申请',
            vi: 'Xem danh sách và áp dụng',
            tl: 'Tingnan ang listahan at mag-apply',
            bn: 'তালিকা দেখুন এবং আবেদন করুন',
            ar: 'عرض القائمة والتقديم',
            fa: 'مشاهده لیست و اعمال',
            hy: 'Դիտեք ցուցակը և կիրառեք',
            ko: '목록 보기 및 신청',
          },
          footer: {
            accessibleMarketingFlyer: 'Naa-access na flyer sa marketing',
            unsubscribeAndEmailSettings:
              'Mag-unsubscribe at pamahalaan ang mga settings ng email',
          },
        },
        accountRemoval: {
          signIn: 'Mag-sign in sa Bloom Housing',
          subject:
            'Bloom Housing Scheduled Account Removal Dahil sa Kawalan ng Aktibidad',
          courtesyText1:
            'Ito ay isang courtesy email upang ipaalam sa iyo na dahil ang iyong Bloom Housing Portal account ay hindi aktibo sa loob ng 3 taon, ang iyong account ay buburahin sa loob ng 30 araw ayon sa aming',
          courtesyText2:
            'Kung nais mong panatilihin ang iyong account, mangyaring mag-log in anumang oras sa susunod na buwan at ituturing naming aktibo muli ang iyong account.',
          privacyPolicy: 'Patakaran sa Pagkapribado',
          privacyPolicyUrl: 'localhost:3000/privacy-policy',
        },
        lotteryAvailable: {
          termsUrl: 'https://www.exygy.com',
          termsOfUse: 'Mga Tuntunin ng Paggamit',
          helpCenterUrl: 'https://www.exygy.com',
          notificationsUrl: 'https://www.exygy.com',
          duplicatesDetails:
            'Ang Bloom sa pangkalahatan ay hindi tumatanggap ng mga duplicate na aplikasyon. Ang isang duplicate na aplikasyon ay isa na mayroong isang tao na lumilitaw din sa isa pang aplikasyon para sa parehong pagkakataon sa pabahay. Para sa mas detalyadong impormasyon sa kung paano namin pinangangasiwaan ang mga duplicate, tingnan ang aming',
        },
        applicationUpdate: {
          title: 'Na-update na ang iyong aplikasyon para sa %{listingName}',
          subject: 'Pag-update ng aplikasyon para sa %{listingName}',
          greeting: 'Kumusta',
          viewLink: 'Tingnan ang aking aplikasyon',
          viewPrompt:
            'Para makita ang iyong aplikasyon, paki-click ang link sa ibaba:',
          statusLabel: 'Katayuan ng aplikasyon',
          statusChange:
            'Nagbago ang katayuan ng iyong aplikasyon mula %{from} patungong %{to}',
          summaryTitle: 'Buod ng mga pagbabago:',
          updateNotice:
            'May ginawang update sa iyong aplikasyon sa pabahay para sa %{listingName}.',
          contactNotice:
            'Wala nang karagdagang aksyon na kinakailangan sa ngayon. Kung mayroon kang mga katanungan tungkol sa update na ito, mangyaring makipag-ugnayan sa',
          declineReason: {
            other: 'Iba pa',
            applicantDeclinedUnit: 'Yunit na tinanggihan ng aplikante',
            householdIncomeTooLow: 'Masyadong mababa ang kita ng sambahayan',
            householdSizeTooLarge: 'Masyadong malaki ang laki ng sambahayan',
            householdSizeTooSmall: 'Masyadong maliit ang laki ng sambahayan',
            householdIncomeTooHigh: 'Masyadong mataas ang kita ng sambahayan',
            attemptedToContactNoResponse:
              'Sinubukan kong kontakin; walang tugon',
            householdDoesNotNeedAccessibleUnit:
              'Hindi kailangan ng sambahayan ang mga accessible unit features',
            doesNotMeetSeniorBuildingRequirement:
              'Hindi nakakatugon sa kinakailangan sa gusali para sa mga matatanda',
          },
          advocateViewLink: 'Tingnan ang aplikasyon',
          applicationStatus: {
            declined: 'Tinanggihan',
            waitlist: 'Waitlist',
            submitted: 'Isinumite',
            receivedUnit: 'Nakatanggap ng unit',
            waitlistDeclined: 'Waitlist - Tinanggihan',
          },
          advocateViewPrompt:
            'Para makita ang aplikasyon ng inyong kliyente, paki-click ang link sa ibaba:',
          declineReasonChange:
            'Ang dahilan ng pagtanggi sa iyong aplikasyon ay %{value}',
          advocateUpdateNotice:
            'May ginawang update sa aplikasyon para sa pabahay na isinumite mo sa ngalan ni %{applicantName} para sa %{listingName}.',
          applicantContactNotice:
            'Kung mayroon kayong mga katanungan tungkol sa update na ito, mangyaring makipag-ugnayan sa',
          accessibleWaitListChange:
            'Ang numero ng iyong wait list sa Accessible ay %{value}',
          conventionalWaitListChange:
            'Ang iyong karaniwang numero ng wait list ay %{value}',
        },
      };
    case LanguagesEnum.bn:
      return {
        applicationBulk: {
          viewApplications: 'আবেদনগুলো দেখুন',
          success: {
            subject:
              '%{listingName}-এর জন্য আপনার বাল্ক আবেদন আপডেট সম্পন্ন হয়েছে',
            message: 'আপনার বাল্ক আপডেট সফলভাবে প্রক্রিয়া করা হয়েছে।',
            count: '%{updateCount}টি আবেদন রেকর্ড আপডেট করা হয়েছে।',
          },
          successWithError: {
            subject:
              '%{listingName}-এর জন্য আপনার বাল্ক আবেদন আপডেট সম্পন্ন হয়েছে',
            message:
              'আপনার বাল্ক আপডেট সফলভাবে প্রক্রিয়া করা হয়েছে। তবে, %{failedEmailsCount}টি আবেদনকারীর বিজ্ঞপ্তি ইমেল পাঠানো যায়নি।',
            errors:
              '%{updateCount}টি আবেদন রেকর্ড আপডেট করা হয়েছে। বিজ্ঞপ্তি সমাধানের পরবর্তী পদক্ষেপের জন্য অনুগ্রহ করে আপনার প্রযুক্তিগত দলের সাথে যোগাযোগ করুন।',
          },
          failure: {
            subject:
              '%{listingName}-এর জন্য আপনার বাল্ক আবেদন আপডেট সম্পন্ন করা যায়নি',
            message:
              'আপনার বাল্ক আপডেটে একটি ত্রুটি দেখা দিয়েছে এবং এটি সম্পন্ন করা যায়নি।',
            help: 'ব্যর্থ সারির আগের রেকর্ডগুলো আপডেট করা হয়েছে। আপনার ফাইল পুনরায় আপলোড করলে সমস্যাটি সমাধান না হলে, অনুগ্রহ করে সহায়তা দলের সাথে যোগাযোগ করুন।',
          },
        },
        advocateApproved: {
          subject: 'আপনার অ্যাকাউন্ট অনুমোদিত হয়েছে',
          hello: 'হ্যালো',
          approvalMessage: '%{appUrl} এ আপনার অ্যাকাউন্ট অনুমোদিত হয়েছে।',
          approvalInfo:
            'আপনার জন্য এখন আরও সহজ হবে শুরু করা, সংরক্ষণ করা এবং অনলাইন আবেদন জমা দেওয়া <strong>আবাসন আবেদনকারীদের পক্ষে</strong> সাইটে উপস্থিত তালিকার জন্য।',
          completeMessage:
            'আপনার অ্যাকাউন্ট তৈরি সম্পূর্ণ করতে, দয়া করে নীচের লিঙ্কটিতে ক্লিক করুন:',
          createAccount: 'আমার অ্যাকাউন্ট তৈরি করুন',
        },
        advocateRejected: {
          subject: 'আপনার অ্যাকাউন্ট অনুরোধ সম্পর্কে আপডেট',
          hello: 'হ্যালো',
          rejectionMessageStart:
            '%{appUrl} এ একটি অ্যাকাউন্ট তৈরিতে আপনার আগ্রহের জন্য ধন্যবাদ।',
          rejectionMessageEnd:
            'আমরা এই সময়ে আপনার অ্যাকাউন্ট অনুমোদন করতে পারি না।',
          rejectionInfoStart:
            'যদি আপনি বিশ্বাস করেন যে এই সিদ্ধান্তটি ত্রুটিতে নেওয়া হয়েছে বা যোগ্যতা সম্পর্কে প্রশ্ন থাকে, দয়া করে আমাদের সাথে যোগাযোগ করুন',
          rejectionInfoEnd: 'আরও তথ্যের জন্য।',
        },
        forgotPassword: {
          subject: 'আপনার পাসওয়ার্ড রিসেট করবেন?',
          resetRequest:
            'আমরা আপনার Bloom হাউজিং পোর্টাল অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার একটি অনুরোধ পেয়েছি। রিসেট সম্পূর্ণ করতে আপনাকে অবশ্যই নিচের লিঙ্কে ক্লিক করতে হবে:',
          ignoreRequest:
            'এই পাসওয়ার্ড রিসেটটি শুধুমাত্র পরবর্তী এক ঘণ্টার জন্য বৈধ। আপনি যদি এই অনুরোধটি না করে থাকেন, তাহলে অনুগ্রহ করে এই ইমেলটি উপেক্ষা করুন।',
          changePassword: 'আমার পাসওয়ার্ড পরিবর্তন করুন',
        },
        rentalOpportunity: {
          subject: '%{listingName}-এ নতুন ভাড়ার সুযোগ',
          intro: 'ভাড়ার সুযোগ:',
          comingSoon: {
            subject: 'শীঘ্রই আসছে - %{listingName}',
            intro: 'শীঘ্রই আসছে',
          },
          community: 'কমিউনিটি',
          communityType: {
            developmentalDisability: 'বিকাশগত অক্ষমতা',
            farmworkerHousing: 'কৃষি শ্রমিকদের আবাসন',
            housingVoucher: 'এইচসিভি/ধারা ৮ ভাউচার',
            referralOnly: 'শুধুমাত্র রেফারেল',
            schoolEmployee: 'স্কুল কর্মচারী',
            senior: 'সিনিয়র',
            senior55: 'প্রবীণ 55+',
            senior62: 'প্রবীণ 62+',
            specialNeeds: 'বিশেষ চাহিদাসম্পন্ন',
            tay: 'TAY - পরিবর্তনশীল বয়স্ক যুবক',
            veteran: 'প্রবীণ',
          },
          applicationsDue: 'আবেদনের শেষ তারিখ',
          applicationsOpen: 'আবেদন শুরুর তারিখ',
          address: 'ঠিকানা',
          neighborhood: 'এলাকা',
          region: 'অঞ্চল',
          unitType: 'উপলব্ধ প্রবেশযোগ্য ইউনিট',
          accessibilityType: {
            hearing: 'শ্রবণ',
            mobility: 'গতিশীলতা',
            vision: 'দৃষ্টি',
            hearingAndVision: 'শ্রবণ/দৃষ্টি',
            mobilityAndHearing: 'গতিশীলতা ও শ্রবণ',
            mobilityAndVision: 'গতিশীলতা ও দৃষ্টি',
            mobilityHearingAndVision: 'গতিশীলতা এবং শ্রবণ/দৃষ্টি',
          },
          opportunityType: 'সুযোগের ধরন',
          lottery: 'লটারি',
          waitlist: 'অপেক্ষার তালিকা',
          unitTypes: {
            SRO: 'SRO',
            studio: 'স্টুডিও',
            oneBdrm: '১ শোয়ার ঘর',
            twoBdrm: '২ শোয়ার ঘর',
            threeBdrm: '৩ শোয়ার ঘর',
            fourBdrm: '৪ শোয়ার ঘর',
            fiveBdrm: '৫ শোয়ার ঘর',
          },
          unitCount: '%{smart_count}টি ইউনিট |||| %{smart_count}টি ইউনিট',
          bathCount: '%{smart_count}টি বাথরুম |||| %{smart_count}টি বাথরুম',
          rent: 'ভাড়া',
          sqft: 'বর্গফুট',
          minIncome: 'সর্বনিম্ন আয়',
          maxIncome: 'সর্বোচ্চ আয়',
          perMonth: 'মাসে',
          ofIncome: 'আয়ের',
          orUpTo: 'বা পর্যন্ত',
          lotteryDate: 'লটারির তারিখ',
          viewListingNotice: {
            line1: 'এই তথ্য পরিবর্তন হতে পারে',
            line2: 'সর্বশেষ তথ্যের জন্য অনুগ্রহ করে তালিকাটি দেখুন',
          },
          viewButton: {
            en: 'View listing & apply',
            es: 'Ver listado y aplicar',
            zh: '查看列表并申请',
            vi: 'Xem danh sách và áp dụng',
            tl: 'Tingnan ang listahan at mag-apply',
            bn: 'তালিকা দেখুন এবং আবেদন করুন',
            ar: 'عرض القائمة والتقديم',
            fa: 'مشاهده لیست و اعمال',
            hy: 'Դիտեք ցուցակը և կիրառեք',
            ko: '목록 보기 및 신청',
          },
          footer: {
            accessibleMarketingFlyer: 'অ্যাক্সেসযোগ্য মার্কেটিং ফ্লায়ার',
            unsubscribeAndEmailSettings:
              'আনসাবস্ক্রাইব করুন এবং ইমেইল সেটিংস পরিচালনা করুন',
          },
        },
        lotteryAvailable: {
          termsUrl: 'https://www.exygy.com',
          termsOfUse: 'ব্যবহারের শর্তাবলি',
          helpCenterUrl: 'https://www.exygy.com',
          notificationsUrl: 'https://www.exygy.com',
          duplicatesDetails:
            'ব্লুম সাধারণত একই আবাসন সুবিধার জন্য একাধিক আবেদনে একই ব্যক্তির নাম থাকলে—অর্থাৎ দ্বৈত আবেদন—তা গ্রহণ করে না। দ্বৈত আবেদনের বিষয়টি আমরা কীভাবে পরিচালনা করি সে সম্পর্কে বিস্তারিত তথ্যের জন্য আমাদের',
        },
        applicationUpdate: {
          title:
            'আপনার অ্যাপ্লিকেশনটি %{listingName} এর জন্য আপডেট করা হয়েছে।',
          subject: '%{listingName} এর জন্য অ্যাপ্লিকেশন আপডেট',
          greeting: 'হ্যালো',
          viewLink: 'আমার আবেদন দেখুন',
          viewPrompt:
            'আপনার আবেদনপত্রটি দেখতে, অনুগ্রহ করে নীচের লিঙ্কে ক্লিক করুন:',
          statusLabel: 'আবেদনের স্থিতি',
          statusChange:
            'আপনার আবেদনের স্থিতি %{from} থেকে %{to} এ পরিবর্তিত হয়েছে।',
          summaryTitle: 'পরিবর্তনের সারসংক্ষেপ:',
          updateNotice:
            '%{listingName} এর জন্য আপনার আবাসন আবেদনে একটি আপডেট করা হয়েছে।',
          contactNotice:
            'এই মুহূর্তে আর কোনও পদক্ষেপ নেওয়ার প্রয়োজন নেই। এই আপডেট সম্পর্কে আপনার যদি কোনও প্রশ্ন থাকে, তাহলে অনুগ্রহ করে যোগাযোগ করুন:',
          declineReason: {
            other: 'অন্যান্য',
            applicantDeclinedUnit: 'আবেদনকারী ইউনিটটি প্রত্যাখ্যান করেছেন',
            householdIncomeTooLow: 'পারিবারিক আয় খুব কম',
            householdSizeTooLarge: 'পরিবারের আকার খুব বড়',
            householdSizeTooSmall: 'পরিবারের আকার খুব ছোট',
            householdIncomeTooHigh: 'পারিবারিক আয় খুব বেশি',
            attemptedToContactNoResponse:
              'যোগাযোগের চেষ্টা করা হয়েছে; কোনো সাড়া পাওয়া যায়নি।',
            householdDoesNotNeedAccessibleUnit:
              'পরিবারের জন্য প্রবেশযোগ্য ইউনিটের বৈশিষ্ট্যের প্রয়োজন নেই।',
            doesNotMeetSeniorBuildingRequirement:
              'সিনিয়র বিল্ডিংয়ের প্রয়োজনীয়তা পূরণ করে না',
          },
          advocateViewLink: 'আবেদন দেখুন',
          applicationStatus: {
            declined: 'প্রত্যাখ্যান করা হয়েছে',
            waitlist: 'অপেক্ষা তালিকা',
            submitted: 'জমা দেওয়া হয়েছে',
            receivedUnit: 'একটি ইউনিট পেয়েছি',
            waitlistDeclined: 'অপেক্ষা তালিকা - প্রত্যাখ্যান করা হয়েছে',
          },
          advocateViewPrompt:
            'আপনার ক্লায়েন্টের আবেদন দেখতে, অনুগ্রহ করে নীচের লিঙ্কে ক্লিক করুন:',
          declineReasonChange: 'আপনার আবেদন প্রত্যাখ্যানের কারণ হল %{value}',
          advocateUpdateNotice:
            '%{applicantName} এর পক্ষ থেকে %{listingName} এর জন্য আপনার জমা দেওয়া আবাসন আবেদনের একটি আপডেট করা হয়েছে।',
          applicantContactNotice:
            'এই আপডেট সম্পর্কে আপনার যদি কোন প্রশ্ন থাকে, তাহলে অনুগ্রহ করে যোগাযোগ করুন',
          accessibleWaitListChange:
            'আপনার অ্যাক্সেসযোগ্য অপেক্ষা তালিকার নম্বর হল %{value}',
          conventionalWaitListChange:
            'আপনার প্রচলিত অপেক্ষা তালিকার নম্বর হল %{value}',
        },
      };
    case LanguagesEnum.ar:
      return {
        applicationBulk: {
          viewApplications: 'عرض الطلبات',
          success: {
            subject: 'اكتمل التحديث المجمّع لطلبك الخاص بـ %{listingName}',
            message: 'تمت معالجة التحديث المجمّع الخاص بك بنجاح.',
            count: 'تم تحديث %{updateCount} من سجلات الطلبات.',
          },
          successWithError: {
            subject: 'اكتمل التحديث المجمّع لطلبك الخاص بـ %{listingName}',
            message:
              'تمت معالجة التحديث المجمّع الخاص بك بنجاح. ومع ذلك، تعذّر إرسال %{failedEmailsCount} من رسائل إشعار مقدّمي الطلبات.',
            errors:
              'تم تحديث %{updateCount} من سجلات الطلبات. يُرجى التواصل مع فريقك التقني لمعرفة الخطوات التالية لحل مشكلة الإشعارات.',
          },
          failure: {
            subject:
              'تعذّر إكمال التحديث المجمّع لطلبك الخاص بـ %{listingName}',
            message: 'واجه التحديث المجمّع الخاص بك خطأً وتعذّر إكماله.',
            help: 'تم تحديث السجلات السابقة للصف الذي فشل. إذا لم تؤدِّ إعادة رفع الملف إلى حل المشكلة، فيُرجى التواصل مع فريق الدعم.',
          },
        },
        advocateApproved: {
          subject: 'تم الموافقة على حسابك',
          hello: 'مرحبا',
          approvalMessage: 'تمت الموافقة على حسابك في %{appUrl}.',
          approvalInfo:
            'سيكون من الأسهل الآن عليك البدء وحفظ وتقديم الطلبات عبر الإنترنت <strong>نيابة عن مقدمي طلبات الإسكان</strong> للقوائم المعروضة على الموقع.',
          completeMessage: 'لإكمال إنشاء حسابك، يرجى النقر على الرابط أدناه:',
          createAccount: 'إنشاء حسابي',
        },
        advocateRejected: {
          subject: 'تحديث بشأن طلب حسابك',
          hello: 'مرحبا',
          rejectionMessageStart: 'شكراً لاهتمامك بإنشاء حساب على %{appUrl}.',
          rejectionMessageEnd: 'لا يمكننا الموافقة على حسابك في الوقت الحالي.',
          rejectionInfoStart:
            'إذا كنت تعتقد أن هذا القرار تم اتخاذه بالخطأ أو لديك أسئلة حول الأهلية، يرجى الاتصال بنا على',
          rejectionInfoEnd: 'للحصول على مزيد من المعلومات.',
        },
        forgotPassword: {
          subject: 'إعادة تعيين كلمة المرور الخاصة بك؟',
          resetRequest:
            'لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في بوابة Bloom للإسكان. يجب النقر على الرابط التالي لإكمال إعادة التعيين:',
          ignoreRequest:
            'إعادة تعيين كلمة المرور هذه صالحة للساعة القادمة فقط. إذا لم تقم بتقديم هذا الطلب، فيرجى تجاهل هذا البريد الإلكتروني.',
          changePassword: 'تغيير كلمة المرور الخاصة بي',
        },
        rentalOpportunity: {
          subject: 'فرصة إيجار جديدة في %{listingName}',
          intro: 'فرصة إيجار في',
          comingSoon: {
            subject: 'قريباً - %{listingName}',
            intro: 'قريباً',
          },
          community: 'المجتمع',
          communityType: {
            developmentalDisability: 'الإعاقة النمائية',
            farmworkerHousing: 'سكن عمال المزارع',
            housingVoucher: 'قسيمة HCV/القسم 8',
            referralOnly: 'الإحالة فقط',
            schoolEmployee: 'موظف المدرسة',
            senior: 'كبار السن',
            senior55: 'لكبار السن فوق 55 سنة',
            senior62: 'لكبار السن فوق 62 سنة',
            specialNeeds: 'الاحتياجات الخاصة',
            tay: 'تاي - الشباب في مرحلة الانتقال',
            veteran: 'محارب قديم',
          },
          applicationsDue: 'تاريخ انتهاء الطلبات',
          applicationsOpen: 'تاريخ فتح الطلبات',
          address: 'العنوان',
          neighborhood: 'الحي',
          region: 'منطقة',
          unitType: 'الوحدات المتاحة لذوي الاحتياجات الخاصة',
          accessibilityType: {
            hearing: 'السمع',
            mobility: 'الحركة',
            vision: 'البصر',
            hearingAndVision: 'السمع/البصر',
            mobilityAndHearing: 'الحركة والسمع',
            mobilityAndVision: 'الحركة والبصر',
            mobilityHearingAndVision: 'الحركة والسمع/البصر',
          },
          opportunityType: 'نوع الفرصة',
          lottery: 'القرعة',
          waitlist: 'قائمة الانتظار',
          unitTypes: {
            SRO: 'SRO',
            studio: 'استوديو',
            oneBdrm: 'غرفة نوم واحدة',
            twoBdrm: 'غرفتا نوم',
            threeBdrm: '3 غرف نوم',
            fourBdrm: '4 غرف نوم',
            fiveBdrm: '5 غرف نوم',
          },
          unitCount: '%{smart_count} وحدة |||| %{smart_count} وحدات',
          bathCount: '%{smart_count} حمام |||| %{smart_count} حمامات',
          rent: 'الإيجار',
          sqft: 'قدم مربع',
          minIncome: 'الحد الأدنى للدخل',
          maxIncome: 'الحد الأقصى للدخل',
          perMonth: 'شهرياً',
          ofIncome: 'من الدخل',
          orUpTo: 'أو ما يصل إلى',
          lotteryDate: 'تاريخ القرعة',
          viewListingNotice: {
            line1: 'قد تتغير هذه المعلومات',
            line2: 'يرجى مراجعة الإعلان للحصول على أحدث المعلومات',
          },
          viewButton: {
            en: 'View listing & apply',
            es: 'Ver listado y aplicar',
            zh: '查看列表并申请',
            vi: 'Xem danh sách và áp dụng',
            tl: 'Tingnan ang listahan at mag-apply',
            bn: 'তালিকা দেখুন এবং আবেদন করুন',
            ar: 'عرض القائمة والتقديم',
            fa: 'مشاهده لیست و اعمال',
            hy: 'Դիտեք ցուցակը և կիրառեք',
            ko: '목록 보기 및 신청',
          },
          footer: {
            accessibleMarketingFlyer: 'نشرة تسويقية ميسّرة',
            unsubscribeAndEmailSettings:
              'إلغاء الاشتراك وإدارة إعدادات البريد الإلكتروني',
          },
        },
        lotteryAvailable: {
          termsUrl: 'https://www.exygy.com',
          termsOfUse: 'شروط الاستخدام',
          helpCenterUrl: 'https://www.exygy.com',
          notificationsUrl: 'https://www.exygy.com',
          duplicatesDetails:
            'بشكل عام، لا تقبل Bloom الطلبات المكررة. ويُقصد بالطلب المكرر ذلك الطلب الذي يتضمن شخصاً يظهر أيضاً في طلب آخر لنفس فرصة السكن. لمزيد من التفاصيل حول كيفية تعاملنا مع الطلبات المكررة، يرجى الاطلاع على',
        },
        applicationUpdate: {
          title: 'تم تحديث طلبك لـ %{listingName}',
          subject: 'تحديث الطلب لـ %{listingName}',
          greeting: 'مرحبًا',
          viewLink: 'اطلع على طلبي',
          viewPrompt: 'للاطلاع على طلبك، يرجى النقر على الرابط أدناه:',
          statusLabel: 'حالة الطلب',
          statusChange: 'لقد تغيرت حالة طلبك من %{from} إلى %{to}',
          summaryTitle: 'ملخص التغييرات:',
          updateNotice: 'تم تحديث طلب السكن الخاص بك لـ %{listingName}.',
          contactNotice:
            'لا يلزم اتخاذ أي إجراء إضافي في الوقت الحالي. إذا كانت لديكم أي استفسارات بخصوص هذا التحديث، يُرجى التواصل معنا على',
          declineReason: {
            other: 'آخر',
            applicantDeclinedUnit: 'رفض مقدم الطلب الوحدة',
            householdIncomeTooLow: 'دخل الأسرة منخفض للغاية',
            householdSizeTooLarge: 'حجم الأسرة كبير جدًا',
            householdSizeTooSmall: 'حجم الأسرة صغير جدًا',
            householdIncomeTooHigh: 'دخل الأسرة مرتفع للغاية',
            attemptedToContactNoResponse: 'تمت محاولة الاتصال؛ لم يتم الرد',
            householdDoesNotNeedAccessibleUnit:
              'لا يحتاج المنزل إلى ميزات وحدة يسهل الوصول إليها',
            doesNotMeetSeniorBuildingRequirement:
              'لا يفي بمتطلبات المباني لكبار السن',
          },
          advocateViewLink: 'عرض الطلب',
          applicationStatus: {
            declined: 'مرفوض',
            waitlist: 'قائمة الانتظار',
            submitted: 'تم التقديم',
            receivedUnit: 'استلم وحدة',
            waitlistDeclined: 'قائمة الانتظار - مرفوض',
          },
          advocateViewPrompt:
            'للاطلاع على طلب عميلك، يرجى النقر على الرابط أدناه:',
          declineReasonChange: 'سبب رفض طلبك هو %{value}',
          advocateUpdateNotice:
            'تم تحديث طلب السكن الذي قدمته نيابة عن %{applicantName} لـ %{listingName}.',
          applicantContactNotice:
            'إذا كانت لديكم أي استفسارات بخصوص هذا التحديث، يرجى التواصل معنا على',
          accessibleWaitListChange:
            'رقمك في قائمة انتظار ذوي الاحتياجات الخاصة هو %{value}',
          conventionalWaitListChange:
            'رقمك في قائمة الانتظار التقليدية هو %{value}',
        },
      };
    case LanguagesEnum.ko:
      return {
        applicationBulk: {
          viewApplications: '신청서 보기',
          success: {
            subject:
              '%{listingName}에 대한 일괄 신청서 업데이트가 완료되었습니다',
            message: '일괄 업데이트가 성공적으로 처리되었습니다.',
            count: '%{updateCount}개의 신청서 기록이 업데이트되었습니다.',
          },
          successWithError: {
            subject:
              '%{listingName}에 대한 일괄 신청서 업데이트가 완료되었습니다',
            message:
              '일괄 업데이트가 성공적으로 처리되었습니다. 그러나 %{failedEmailsCount}개의 신청자 알림 이메일을 보낼 수 없었습니다.',
            errors:
              '%{updateCount}개의 신청서 기록이 업데이트되었습니다. 알림 문제 해결을 위한 다음 단계에 대해서는 기술팀에 문의하세요.',
          },
          failure: {
            subject:
              '%{listingName}에 대한 일괄 신청서 업데이트를 완료할 수 없습니다',
            message: '일괄 업데이트 중 오류가 발생하여 완료할 수 없었습니다.',
            help: '실패한 행 이전의 기록은 업데이트되었습니다. 파일을 다시 업로드해도 문제가 해결되지 않으면 지원팀에 문의하세요.',
          },
        },
        advocateApproved: {
          subject: '계정이 승인되었습니다',
          hello: '안녕하세요',
          approvalMessage: '%{appUrl}의 계정이 승인되었습니다.',
          approvalInfo:
            '이제 주택 신청자를 대신하여 온라인 신청서를 쉽게 시작, 저장 및 제출할 수 있습니다 <strong>사이트에 나타나는 목록에 대해</strong>.',
          completeMessage: '계정 생성을 완료하려면 아래 링크를 클릭하세요:',
          createAccount: '내 계정 만들기',
        },
        advocateRejected: {
          subject: '계정 요청에 대한 업데이트',
          hello: '안녕하세요',
          rejectionMessageStart:
            '%{appUrl}에서 계정을 만들려는 관심을 가져주셔서 감사합니다.',
          rejectionMessageEnd: '현재 귀하의 계정을 승인할 수 없습니다.',
          rejectionInfoStart:
            '이 결정이 오류로 인해 결정되었다고 생각하거나 자격 요건에 대해 질문이 있으면 다음 주소로 문의하세요',
          rejectionInfoEnd: '자세한 내용은',
        },
        forgotPassword: {
          subject: '비밀번호를 재설정하시겠습니까?',
          resetRequest:
            'Bloom 주택 포털 계정의 비밀번호 재설정 요청을 받았습니다. 재설정을 완료하려면 다음 링크를 클릭해야 합니다:',
          ignoreRequest:
            '이 비밀번호 재설정은 앞으로 1시간 동안만 유효합니다. 이 요청을 하지 않으셨다면 이 이메일을 무시하세요.',
          changePassword: '내 비밀번호 변경',
        },
        rentalOpportunity: {
          subject: '%{listingName}의 새로운 임대 기회',
          intro: '임대 기회 위치:',
          comingSoon: {
            subject: '곧 공개 예정 - %{listingName}',
            intro: '곧 공개 예정',
          },
          community: '커뮤니티',
          communityType: {
            developmentalDisability: '발달 장애',
            farmworkerHousing: '농장 노동자 숙소',
            housingVoucher: 'HCV/섹션 8 바우처',
            referralOnly: '추천 전용',
            schoolEmployee: '학교 직원',
            senior: '어른',
            senior55: '55세 이상 시니어',
            senior62: '62세 이상 시니어',
            specialNeeds: '특별한 요구',
            tay: 'TAY - 전환기 청소년',
            veteran: '재향 군인',
          },
          applicationsDue: '신청 마감일',
          applicationsOpen: '신청 시작일',
          address: '주소',
          neighborhood: '동네',
          region: '지역',
          unitType: '장애인 접근 가능 객실',
          accessibilityType: {
            hearing: '청각',
            mobility: '이동성',
            vision: '시각',
            hearingAndVision: '청각/시각',
            mobilityAndHearing: '이동성 및 청각',
            mobilityAndVision: '이동성 및 시각',
            mobilityHearingAndVision: '이동성 및 청각/시각',
          },
          opportunityType: '기회 유형',
          lottery: '추첨',
          waitlist: '대기자 명단',
          unitTypes: {
            SRO: 'SRO',
            studio: '스튜디오',
            oneBdrm: '침실 1개',
            twoBdrm: '침실 2개',
            threeBdrm: '침실 3개',
            fourBdrm: '침실 4개',
            fiveBdrm: '침실 5개',
          },
          unitCount: '%{smart_count}개 유닛 |||| %{smart_count}개 유닛',
          bathCount: '%{smart_count}개 욕실 |||| %{smart_count}개 욕실',
          rent: '임대료',
          sqft: '평방피트',
          minIncome: '최소 소득',
          maxIncome: '최대 소득',
          perMonth: '월',
          ofIncome: '소득의',
          orUpTo: '또는 최대',
          lotteryDate: '추첨 날짜',
          viewListingNotice: {
            line1: '이 정보는 변경될 수 있습니다',
            line2: '최신 정보는 목록을 확인하시기 바랍니다',
          },
          viewButton: {
            en: 'View listing & apply',
            es: 'Ver listado y aplicar',
            zh: '查看列表并申请',
            vi: 'Xem danh sách và áp dụng',
            tl: 'Tingnan ang listahan at mag-apply',
            bn: 'তালিকা দেখুন এবং আবেদন করুন',
            ar: 'عرض القائمة والتقديم',
            fa: 'مشاهده لیست و اعمال',
            hy: 'Դիտեք ցուցակը և կիրառեք',
            ko: '목록 보기 및 신청',
          },
          footer: {
            accessibleMarketingFlyer: '접근 가능한 마케팅 전단지',
            unsubscribeAndEmailSettings: '구독 취소 및 이메일 설정 관리',
          },
        },
        confirmation: {
          eligible: {
            waitlistContactAdvocate:
              '대기자 명단에 있는 고객에게 연락하여 대기자 명단에 계속 남아 있기를 원하는지 확인하는 절차를 거칠 수 있습니다.',
          },
          questions: '질문?',
          interviewAdvocate:
            '의뢰인이 인터뷰 요청을 받게 되면, 보다 자세한 신청서를 작성하고 관련 서류를 제출해야 합니다.',
          gotYourConfirmationNumberOnYourBehalf:
            '저희는 귀하를 대신하여 신청서를 접수했습니다.',
        },
        leasingAgent: {
          contactAgentForQuestions:
            '본 신청서와 관련하여 궁금한 사항이 있으시면 해당 매물 담당자에게 문의해 주십시오.',
        },
        lotteryAvailable: {
          termsUrl: 'https://www.exygy.com',
          termsOfUse: '이용 약관',
          helpCenterUrl: 'https://www.exygy.com',
          notificationsUrl: 'https://www.exygy.com',
          duplicatesDetails:
            'Bloom은 일반적으로 중복 신청을 허용하지 않습니다. 중복 신청이란 동일한 주택 공급 건에 대해 다른 신청서에도 이름이 올라가 있는 지원자가 포함된 경우를 의미합니다. 중복 신청 처리 방식에 대한 자세한 내용은 다음을 참조하십시오',
        },
        applicationUpdate: {
          title: '귀하의 신청서가 %{listingName}에 대해 업데이트되었습니다.',
          subject: '%{listingName}에 대한 애플리케이션 업데이트',
          greeting: '안녕하세요',
          viewLink: '내 지원서를 봐주세요',
          viewPrompt: '신청서를 보시려면 아래 링크를 클릭하세요.',
          statusLabel: '신청 상태',
          statusChange: '신청 상태가 %{from}에서 %{to}로 변경되었습니다.',
          summaryTitle: '변경 사항 요약:',
          updateNotice:
            '%{listingName}에 대한 주택 신청서가 업데이트되었습니다.',
          contactNotice:
            '현재로서는 추가 조치가 필요하지 않습니다. 이번 업데이트와 관련하여 궁금한 사항이 있으시면 문의해 주세요.',
          declineReason: {
            other: '다른',
            applicantDeclinedUnit: '지원자가 해당 부서를 거부했습니다.',
            householdIncomeTooLow: '가계 소득이 너무 낮음',
            householdSizeTooLarge: '가구 규모가 너무 큽니다',
            householdSizeTooSmall: '가구 규모가 너무 작습니다',
            householdIncomeTooHigh: '가계 소득이 너무 높음',
            attemptedToContactNoResponse:
              '연락을 시도했으나 응답이 없었습니다.',
            householdDoesNotNeedAccessibleUnit:
              '해당 가구는 장애인 편의시설이 필요한 주택이 아닙니다.',
            doesNotMeetSeniorBuildingRequirement:
              '노인 주거 시설 요건을 충족하지 않습니다.',
          },
          advocateViewLink: '지원서 보기',
          applicationStatus: {
            declined: '거절됨',
            waitlist: '대기자 명단',
            submitted: '제출된',
            receivedUnit: '유닛을 받았습니다',
            waitlistDeclined: '대기자 명단 - 거절됨',
          },
          advocateViewPrompt:
            '고객님의 신청서를 보시려면 아래 링크를 클릭하십시오.',
          declineReasonChange: '귀하의 지원서가 거절된 이유는 %{value}입니다.',
          advocateUpdateNotice:
            '귀하께서 %{applicantName} 님을 대신하여 %{listingName}에 제출하신 주택 신청서가 업데이트되었습니다.',
          applicantContactNotice:
            '이번 업데이트와 관련하여 궁금한 사항이 있으시면 언제든지 문의해 주세요.',
          accessibleWaitListChange:
            '귀하의 장애인 대기자 명단 순번은 %{value}입니다.',
          conventionalWaitListChange:
            '귀하의 일반 대기자 명단 순번은 %{value}입니다.',
        },
      };
    case LanguagesEnum.hy:
      return {
        applicationBulk: {
          viewApplications: 'Դիտել դիմումները',
          success: {
            subject:
              '%{listingName}-ի համար Ձեր դիմումների զանգվածային թարմացումն ավարտված է',
            message: 'Ձեր զանգվածային թարմացումը հաջողությամբ մշակվել է։',
            count: 'Թարմացվել է դիմումների %{updateCount} գրառում։',
          },
          successWithError: {
            subject:
              '%{listingName}-ի համար Ձեր դիմումների զանգվածային թարմացումն ավարտված է',
            message:
              'Ձեր զանգվածային թարմացումը հաջողությամբ մշակվել է։ Այնուամենայնիվ, %{failedEmailsCount} դիմորդի ծանուցման նամակ չհաջողվեց ուղարկել։',
            errors:
              'Թարմացվել է դիմումների %{updateCount} գրառում։ Ծանուցումների լուծման հաջորդ քայլերի համար խնդրում ենք կապվել Ձեր տեխնիկական թիմի հետ։',
          },
          failure: {
            subject:
              '%{listingName}-ի համար Ձեր դիմումների զանգվածային թարմացումը չհաջողվեց ավարտել',
            message:
              'Ձեր զանգվածային թարմացումը հանդիպեց սխալի և չհաջողվեց ավարտել։',
            help: 'Ձախողված տողից առաջ գրառումները թարմացվել են։ Եթե Ձեր ֆայլի կրկնակի վերբեռնումը չլուծի խնդիրը, խնդրում ենք կապվել աջակցման թիմի հետ։',
          },
        },
        advocateApproved: {
          subject: 'Ձեր հաշիվը հաստատվել է',
          hello: 'Բարեւ',
          approvalMessage: 'Ձեր հաշիվը %{appUrl}-ում հաստատվել է:',
          approvalInfo:
            'Այժմ ավելի հեշտ կլինի հստեղել, պահել և ներկայացնել առցանց դիմումներ <strong>բնակարանային դիմորդների կամ հետ</strong> կայքում հայտնված ցուցակների համար:',
          completeMessage:
            'Ձեր հաշվի ստեղծումն ավարտելու համար խնդրում ենք կտտացնել ստորեւ բերված հղումը.',
          createAccount: 'Ստեղծել իմ հաշիվը',
        },
        advocateRejected: {
          subject: 'Թարմացում ձեր հաշվի հարցումի վերաբերյալ',
          hello: 'Բարեւ',
          rejectionMessageStart:
            'Շնորհակալ ենք %{appUrl}-ում հաշիվ ստեղծելու միջնորդության համար:',
          rejectionMessageEnd: 'Մենք չենք կարող հաստատել ձեր հաշիվը այս պահին:',
          rejectionInfoStart:
            'Եթե Դուք կարծում եք, որ այս որոշումը սխալ է կամ ունեք հարցեր պատկանելիության վերաբերյալ, խնդրում ենք մեզ հետ կապ հաստատել',
          rejectionInfoEnd: 'ավելի շատ տեղեկատվության համար:',
        },
        forgotPassword: {
          subject: 'Վերականգնե՞լ ձեր գաղտնաբառը:',
          resetRequest:
            'Մենք ստացել ենք ձեր Bloom բնակարանային պորտալի հաշվի գաղտնաբառը վերականգնելու հարցում: Վերականգնումն ավարտելու համար դուք պետք է սեղմեք հետևյալ հղումը.',
          ignoreRequest:
            'Գաղտնաբառի այս վերականգնումը վավեր է միայն հաջորդ մեկ ժամվա ընթացքում: Եթե դուք չեք կատարել այս հարցումը, խնդրում ենք անտեսել այս նամակը:',
          changePassword: 'Փոխել իմ գաղտնաբառը',
        },
        rentalOpportunity: {
          subject: 'Նոր վարձակալության հնարավորություն՝ %{listingName}',
          intro: 'Վարձակալության հնարավորություն',
          comingSoon: {
            subject: 'Շուտով - %{listingName}',
            intro: 'Շուտով',
          },
          community: 'Համայնք',
          communityType: {
            developmentalDisability: 'Զարգացման հաշմանդամություն',
            farmworkerHousing: 'Գյուղատնտեսական աշխատողների բնակարան',
            housingVoucher: 'HCV/Բաժին 8-ի վաուչեր',
            referralOnly: 'Միայն ուղղորդում',
            schoolEmployee: 'Դպրոցի աշխատակից',
            senior: 'Ավագներ',
            senior55: '55+ տարեկան տարեցներ',
            senior62: 'Ավագներ 62+',
            specialNeeds: 'Հատուկ կարիքներ',
            tay: 'TAY - Անցումային տարիքի երիտասարդություն',
            veteran: 'Վետերան',
          },
          applicationsDue: 'Դիմումների վերջնաժամկետ',
          applicationsOpen: 'Դիմումների մեկնարկի ամսաթիվ',
          address: 'Հասցե',
          neighborhood: 'Թաղամաս',
          region: 'Տարածաշրջան',
          unitType: 'Հասանելի հաշմանդամների համար նախատեսված միավորներ',
          accessibilityType: {
            hearing: 'Լսողություն',
            mobility: 'Շարժունակություն',
            vision: 'Տեսողություն',
            hearingAndVision: 'Լսողություն/տեսողություն',
            mobilityAndHearing: 'Շարժունակություն և լսողություն',
            mobilityAndVision: 'Շարժունակություն և տեսողություն',
            mobilityHearingAndVision:
              'Շարժունակություն և լսողություն/տեսողություն',
          },
          opportunityType: 'Հնարավորության տեսակ',
          lottery: 'Վիճակախաղ',
          waitlist: 'Սպասման ցուցակ',
          unitTypes: {
            SRO: 'SRO',
            studio: 'Ստուդիո',
            oneBdrm: '1 ննջասենյակ',
            twoBdrm: '2 ննջասենյակ',
            threeBdrm: '3 ննջասենյակ',
            fourBdrm: '4 ննջասենյակ',
            fiveBdrm: '5 ննջասենյակ',
          },
          unitCount: '%{smart_count} բնակարան |||| %{smart_count} բնակարան',
          bathCount: '%{smart_count} լոգարան |||| %{smart_count} լոգարան',
          rent: 'Վարձավճար',
          sqft: 'քառ. ֆուտ',
          minIncome: 'Նվազագույն եկամուտ',
          maxIncome: 'Առավելագույն եկամուտ',
          perMonth: 'ամսական',
          ofIncome: 'եկամուտի',
          orUpTo: 'կամ մինչև',
          lotteryDate: 'Վիճակախաղի ամսաթիվ',
          viewListingNotice: {
            line1: 'ԱՅՍ ՏԵՂԵԿԱՏՎՈՒԹՅՈՒՆԸ ԿԱՐՈՂ Է ՓՈՓՈԽՎԵԼ',
            line2: 'Խնդրում ենք դիտել ցուցակը ամենաթարմ տեղեկատվության համար',
          },
          viewButton: {
            en: 'View listing & apply',
            es: 'Ver listado y aplicar',
            zh: '查看列表并申请',
            vi: 'Xem danh sách và áp dụng',
            tl: 'Tingnan ang listahan at mag-apply',
            bn: 'তালিকা দেখুন এবং আবেদন করুন',
            ar: 'عرض القائمة والتقديم',
            fa: 'مشاهده لیست و اعمال',
            hy: 'Դիտեք ցուցակը և կիրառեք',
            ko: '목록 보기 및 신청',
          },
          footer: {
            accessibleMarketingFlyer: 'Հասանելի մարքեթինգային թռուցիկ',
            unsubscribeAndEmailSettings:
              'Դադարեցնել բաժանորդագրությունը և կառավարել էլ. փոստի կարգավորումները',
          },
        },
        confirmation: {
          eligible: {
            waitlistContactAdvocate:
              'Ձեր հաճախորդի հետ կարող են կապ հաստատել սպասման ցուցակում գտնվելու ընթացքում՝ հաստատելու համար, որ նա ցանկանում է մնալ սպասման ցուցակում։',
          },
          questions: 'Հարցեր՞',
          interviewAdvocate:
            'Եթե ձեր հաճախորդի հետ կապ հաստատեն հարցազրույցի համար, նրան կխնդրեն լրացնել ավելի մանրամասն դիմում և տրամադրել հիմնավորող փաստաթղթեր։',
          gotYourConfirmationNumberOnYourBehalf:
            'Մենք Ձեր անունից դիմում ենք ստացել',
        },
        leasingAgent: {
          contactAgentForQuestions:
            'Եթե ունեք հարցեր այս դիմումի վերաբերյալ, խնդրում ենք կապվել այս ցուցակի գործակալի հետ։',
        },
        lotteryAvailable: {
          termsUrl: 'https://www.exygy.com',
          termsOfUse: 'Օգտագործման պայմաններ',
          helpCenterUrl: 'https://www.exygy.com',
          notificationsUrl: 'https://www.exygy.com',
          duplicatesDetails:
            'Bloom-ը, որպես կանոն, չի ընդունում կրկնօրինակ դիմումներ: Կրկնօրինակ դիմումը այն դիմումն է, որի դեպքում անձը նույնպես նշված է նույն բնակարանային հնարավորության համար նախատեսված մեկ այլ դիմումում: Կրկնօրինակ դիմումների հետ վարվելու վերաբերյալ ավելի մանրամասն տեղեկությունների համար տե՛ս մեր',
        },
        applicationUpdate: {
          title: 'Ձեր ծրագիրը թարմացվել է %{listingName}-ի համար',
          subject: '%{listingName} ծրագրի թարմացում',
          greeting: 'Բարև',
          viewLink: 'Դիտել իմ դիմումը',
          viewPrompt:
            'Ձեր դիմումը դիտելու համար, խնդրում ենք սեղմել ստորև նշված հղումը՝',
          statusLabel: 'Դիմումի կարգավիճակը',
          statusChange:
            'Ձեր դիմումի կարգավիճակը փոխվել է %{from}-ից մինչև %{to}',
          summaryTitle: 'Փոփոխությունների ամփոփում.',
          updateNotice:
            'Ձեր %{listingName}-ի բնակարանային դիմումը թարմացվել է։',
          contactNotice:
            'Այս պահին որևէ հետագա գործողություն անհրաժեշտ չէ: Եթե ունեք հարցեր այս թարմացման վերաբերյալ, խնդրում ենք կապվել հետևյալ հասցեով՝',
          declineReason: {
            other: 'Այլ',
            applicantDeclinedUnit: 'Դիմորդը մերժեց միավորը',
            householdIncomeTooLow: 'Ընտանեկան եկամուտը չափազանց ցածր է',
            householdSizeTooLarge: 'Տնային տնտեսության չափը չափազանց մեծ է',
            householdSizeTooSmall: 'Տնային տնտեսության չափը չափազանց փոքր է',
            householdIncomeTooHigh: 'Ընտանեկան եկամուտը չափազանց բարձր է',
            attemptedToContactNoResponse: 'Փորձեցի կապ հաստատել, պատասխան չկա',
            householdDoesNotNeedAccessibleUnit:
              'Տնային տնտեսությունը կարիք չունի հասանելի միավորի հատկանիշների',
            doesNotMeetSeniorBuildingRequirement:
              'Չի համապատասխանում ավագ շենքի պահանջներին',
          },
          advocateViewLink: 'Դիտել դիմումը',
          applicationStatus: {
            declined: 'Մերժված է',
            waitlist: 'Սպասման ցուցակ',
            submitted: 'Ուղարկված է',
            receivedUnit: 'Ստացել է միավոր',
            waitlistDeclined: 'Սպասման ցուցակ - Մերժված է',
          },
          advocateViewPrompt:
            'Ձեր հաճախորդի դիմումը դիտելու համար, խնդրում ենք սեղմել ստորև նշված հղումը.',
          declineReasonChange: 'Ձեր դիմումի մերժման պատճառը %{value} է',
          advocateUpdateNotice:
            '%{applicantName}-ի անունից %{listingName}-ի համար ձեր ներկայացրած բնակարանային դիմումը թարմացվել է։',
          applicantContactNotice:
            'Եթե ունեք հարցեր այս թարմացման վերաբերյալ, խնդրում ենք կապվել հետևյալ հասցեով.',
          accessibleWaitListChange:
            'Ձեր հասանելի սպասման ցուցակի համարը %{value} է',
          conventionalWaitListChange:
            'Ձեր սովորական սպասման ցուցակի համարը %{value} է',
        },
      };
    case LanguagesEnum.fa:
      return {
        applicationBulk: {
          viewApplications: 'مشاهده درخواست‌ها',
          success: {
            subject:
              'به‌روزرسانی گروهی درخواست شما برای %{listingName} کامل شد',
            message: 'به‌روزرسانی گروهی شما با موفقیت پردازش شد.',
            count: '%{updateCount} سابقه درخواست به‌روزرسانی شد.',
          },
          successWithError: {
            subject:
              'به‌روزرسانی گروهی درخواست شما برای %{listingName} کامل شد',
            message:
              'به‌روزرسانی گروهی شما با موفقیت پردازش شد. با این حال، %{failedEmailsCount} ایمیل اطلاع‌رسانی به متقاضیان ارسال نشد.',
            errors:
              '%{updateCount} سابقه درخواست به‌روزرسانی شد. لطفاً برای مراحل بعدی جهت رفع مشکل اطلاع‌رسانی‌ها با تیم فنی خود تماس بگیرید.',
          },
          failure: {
            subject:
              'به‌روزرسانی گروهی درخواست شما برای %{listingName} قابل تکمیل نبود',
            message: 'به‌روزرسانی گروهی شما با خطا مواجه شد و قابل تکمیل نبود.',
            help: 'سوابق پیش از ردیف ناموفق به‌روزرسانی شده‌اند. اگر بارگذاری مجدد فایل شما مشکل را برطرف نکرد، لطفاً با تیم پشتیبانی تماس بگیرید.',
          },
        },
        advocateApproved: {
          subject: 'حساب شما تأیید شد',
          hello: 'سلام',
          approvalMessage: 'حساب شما در %{appUrl} تأیید شد.',
          approvalInfo:
            'اکنون برای شما آسان‌تر خواهد بود که برنامه‌های آنلاین را شروع، ذخیره و ارسال کنید <strong>به نمایندگی از متقاضیان مسکن</strong> برای فهرست‌های موجود در سایت.',
          completeMessage:
            'برای تکمیل ایجاد حساب خود، لطفاً روی پیوند زیر کلیک کنید:',
          createAccount: 'ایجاد حساب من',
        },
        advocateRejected: {
          subject: 'بروزرسانی درخصوص درخواست حساب شما',
          hello: 'سلام',
          rejectionMessageStart:
            'با تشکر از علاقه‌مندی شما به ایجاد حساب در %{appUrl}.',
          rejectionMessageEnd:
            'ما در حال حاضر نمی‌توانیم حساب شما را تأیید کنیم.',
          rejectionInfoStart:
            'اگر فکر می‌کنید این تصمیم اشتباهی است یا سؤالاتی درباره واجدین شرایط دارید، لطفاً با ما تماس بگیرید',
          rejectionInfoEnd: 'برای اطلاعات بیشتر.',
        },
        forgotPassword: {
          subject: 'بازنشانی رمز عبور شما؟',
          resetRequest:
            'ما درخواستی برای بازنشانی رمز عبور حساب پورتال مسکن Bloom شما دریافت کردیم. برای تکمیل بازنشانی باید روی پیوند زیر کلیک کنید:',
          ignoreRequest:
            'این بازنشانی رمز عبور فقط تا یک ساعت آینده معتبر است. اگر شما این درخواست را ثبت نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.',
          changePassword: 'تغییر رمز عبور من',
        },
        rentalOpportunity: {
          subject: 'فرصت اجاره جدید در %{listingName}',
          intro: 'فرصت اجاره در',
          comingSoon: {
            subject: 'به زودی - %{listingName}',
            intro: 'به زودی',
          },
          community: 'جامعه',
          communityType: {
            developmentalDisability: 'ناتوانی رشدی',
            farmworkerHousing: 'مسکن کارگران مزرعه',
            housingVoucher: 'کوپن HCV/بخش ۸',
            referralOnly: 'فقط ارجاع',
            schoolEmployee: 'کارمند مدرسه',
            senior: 'سالمندان',
            senior55: 'سالمندان ۵۵ سال به بالا',
            senior62: 'سالمندان ۶۲+ سال',
            specialNeeds: 'نیازهای ویژه',
            tay: 'TAY - جوانان در سنین گذار',
            veteran: 'جانباز',
          },
          applicationsDue: 'مهلت ارسال درخواست',
          applicationsOpen: 'تاریخ شروع درخواست‌ها',
          address: 'آدرس',
          neighborhood: 'محله',
          region: 'منطقه',
          unitType: 'واحدهای قابل دسترس موجود',
          accessibilityType: {
            hearing: 'شنوایی',
            mobility: 'تحرک',
            vision: 'بینایی',
            hearingAndVision: 'شنوایی/بینایی',
            mobilityAndHearing: 'تحرک و شنوایی',
            mobilityAndVision: 'تحرک و بینایی',
            mobilityHearingAndVision: 'تحرک و شنوایی/بینایی',
          },
          opportunityType: 'نوع فرصت',
          lottery: 'قرعه‌کشی',
          waitlist: 'لیست انتظار',
          unitTypes: {
            SRO: 'SRO',
            studio: 'استودیو',
            oneBdrm: '۱ اتاق خواب',
            twoBdrm: '۲ اتاق خواب',
            threeBdrm: '۳ اتاق خواب',
            fourBdrm: '۴ اتاق خواب',
            fiveBdrm: '۵ اتاق خواب',
          },
          unitCount: '%{smart_count} واحد |||| %{smart_count} واحد',
          bathCount: '%{smart_count} حمام |||| %{smart_count} حمام',
          rent: 'اجاره',
          sqft: 'فوت مربع',
          minIncome: 'حداقل درآمد',
          maxIncome: 'حداکثر درآمد',
          perMonth: 'در ماه',
          ofIncome: 'از درآمد',
          orUpTo: 'یا تا',
          lotteryDate: 'تاریخ قرعه‌کشی',
          viewListingNotice: {
            line1: 'این اطلاعات ممکن است تغییر کند',
            line2: 'لطفاً برای جدیدترین اطلاعات، آگهی را مشاهده کنید',
          },
          footer: {
            accessibleMarketingFlyer: 'بروشور بازاریابی قابل دسترس',
            unsubscribeAndEmailSettings: 'لغو اشتراک و مدیریت تنظیمات ایمیل',
          },
        },
        confirmation: {
          eligible: {
            waitlistContactAdvocate:
              'ممکن است در زمان حضور در لیست انتظار، با موکل شما تماس گرفته شود تا تأیید شود که مایل به ماندن در لیست انتظار است.',
          },
          questions: 'سوالات؟',
          interviewAdvocate:
            'اگر با موکل شما برای مصاحبه تماس گرفته شود، از او خواسته می‌شود فرم درخواست دقیق‌تری را پر کند و مدارک پشتیبان را ارائه دهد.',
          gotYourConfirmationNumberOnYourBehalf:
            'ما از طرف شما درخواستی دریافت کردیم برای',
        },
        leasingAgent: {
          contactAgentForQuestions:
            'اگر در مورد این درخواست سوالی دارید، لطفاً با نماینده این آگهی تماس بگیرید.',
        },
        lotteryAvailable: {
          termsUrl: 'https://www.exygy.com',
          termsOfUse: 'شرایط استفاده',
          helpCenterUrl: 'https://www.exygy.com',
          notificationsUrl: 'https://www.exygy.com',
          duplicatesDetails:
            'بلوم عموماً درخواست‌های تکراری را نمی‌پذیرد. درخواست تکراری، درخواستی است که در آن شخصی در درخواست دیگری برای همان فرصت مسکن نیز حضور دارد. برای اطلاعات بیشتر در مورد نحوه رسیدگی ما به درخواست‌های تکراری، به وب‌سایت ما مراجعه کنید',
        },
        applicationUpdate: {
          title: 'برنامه شما برای %{listingName} به‌روزرسانی شده است.',
          subject: 'به‌روزرسانی برنامه برای %{listingName}',
          greeting: 'سلام',
          viewLink: 'مشاهده درخواست من',
          viewPrompt: 'برای مشاهده درخواست خود، لطفاً روی لینک زیر کلیک کنید:',
          statusLabel: 'وضعیت درخواست',
          statusChange: 'وضعیت درخواست شما از %{from} به %{to} تغییر کرده است.',
          summaryTitle: 'خلاصه تغییرات:',
          updateNotice:
            'به‌روزرسانی در درخواست مسکن شما برای %{listingName} انجام شد.',
          contactNotice:
            'در حال حاضر هیچ اقدام دیگری لازم نیست. اگر در مورد این به‌روزرسانی سؤالی دارید، لطفاً با ما تماس بگیرید.',
          declineReason: {
            other: 'دیگر',
            applicantDeclinedUnit: 'متقاضی واحد را رد کرد',
            householdIncomeTooLow: 'درآمد خانوار خیلی پایین است',
            householdSizeTooLarge: 'اندازه خانه خیلی بزرگ است',
            householdSizeTooSmall: 'اندازه خانه خیلی کوچک است',
            householdIncomeTooHigh: 'درآمد خانوار خیلی بالاست',
            attemptedToContactNoResponse: 'تلاش برای تماس؛ بدون پاسخ',
            householdDoesNotNeedAccessibleUnit:
              'خانوار به ویژگی‌های واحد قابل دسترس نیاز ندارد',
            doesNotMeetSeniorBuildingRequirement:
              'الزامات ساختمان‌های قدیمی را برآورده نمی‌کند',
          },
          advocateViewLink: 'مشاهده برنامه',
          applicationStatus: {
            declined: 'رد شد',
            waitlist: 'لیست انتظار',
            submitted: 'ارسال شده',
            receivedUnit: 'واحد دریافت شد',
            waitlistDeclined: 'لیست انتظار - رد شد',
          },
          advocateViewPrompt:
            'برای مشاهده درخواست مشتری خود، لطفاً روی لینک زیر کلیک کنید:',
          declineReasonChange: 'دلیل رد درخواست شما %{value} است.',
          advocateUpdateNotice:
            'درخواست مسکنی که از طرف %{applicantName} برای %{listingName} ارسال کرده بودید، به‌روزرسانی شد.',
          applicantContactNotice:
            'اگر در مورد این به‌روزرسانی سؤالی دارید، لطفاً با ما تماس بگیرید',
          accessibleWaitListChange:
            'شماره لیست انتظار قابل دسترس شما %{value} است.',
          conventionalWaitListChange:
            'شماره لیست انتظار متعارف شما %{value} است.',
        },
      };
    default: // This also handles LanguagesEnum.en
      if (jurisdiction) {
        return {
          footer: {
            line1: jurisdiction.name,
            line2: '',
            thankYou: 'Thank you',
            footer: jurisdiction.name,
          },
        };
      }
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
          line1: 'Bloom',
          line2: '',
          thankYou: 'Thank you',
          footer: 'Bloom Housing',
        },
        header: {
          logoUrl:
            'https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/dev/bloom_logo_generic_zgb4sg.jpg',
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
          message:
            'An email address change has been requested for your account.',
          changeMyEmail: 'Confirm email change',
          onChangeEmailMessage:
            'To confirm the change to your email address, please click the link below:',
        },
        applicationUpdate: {
          subject: 'Application update for %{listingName}',
          title: 'Your application has been updated for %{listingName}',
          greeting: 'Hello',
          updateNotice:
            'An update has been made to your housing application for %{listingName}.',
          advocateUpdateNotice:
            'An update has been made to the housing application you submitted on behalf of %{applicantName} for %{listingName}.',
          summaryTitle: 'Summary of changes:',
          statusChange:
            'Your application status has changed from %{from} to %{to}',
          declineReasonChange: 'Your application decline reason is %{value}',
          accessibleWaitListChange:
            'Your Accessible wait list number is %{value}',
          conventionalWaitListChange:
            'Your Conventional wait list number is %{value}',
          statusLabel: 'Application status',
          contactNotice:
            'No further action is required at this time. If you have questions regarding this update, please reach out at',
          applicantContactNotice:
            'If you have questions regarding this update, please reach out at',
          viewPrompt: 'To view your application, please click the link below:',
          viewLink: 'View my application',
          advocateViewPrompt:
            "To view your client's application, please click the link below:",
          advocateViewLink: 'View application',
          applicationStatus: {
            submitted: 'Submitted',
            declined: 'Declined',
            receivedUnit: 'Received a unit',
            waitlist: 'Wait list',
            waitlistDeclined: 'Wait list - Declined',
          },
          declineReason: {
            householdIncomeTooHigh: 'Household income too high',
            householdIncomeTooLow: 'Household income too low',
            householdSizeTooLarge: 'Household size too large',
            householdSizeTooSmall: 'Household size too small',
            attemptedToContactNoResponse: 'Attempted to contact; no response',
            applicantDeclinedUnit: 'Applicant declined unit',
            doesNotMeetSeniorBuildingRequirement:
              'Does not meet senior building requirement',
            householdDoesNotNeedAccessibleUnit:
              'Household does not need accessible unit features',
            other: 'Other',
          },
        },
        applicationBulk: {
          viewApplications: 'View Applications',
          success: {
            subject:
              'Your bulk application update for %{listingName} is complete',
            message: 'Your bulk update has been processed successfully.',
            count: '%{updateCount} application records were updated.',
          },
          successWithError: {
            subject:
              'Your bulk application update for %{listingName} is complete',
            message:
              'Your bulk update has been processed successfully. However, %{failedEmailsCount} applicant notification email(s) could not be sent.',
            errors:
              '%{updateCount} application records were updated. Please contact your technical team for next steps on notifications resolution.',
          },
          failure: {
            subject:
              'Your bulk application update for %{listingName} could not be completed',
            message:
              'Your bulk update encountered an error and could not be completed.',
            help: 'Records before the failed row have been updated. If a re-upload of your file does not fix the issue, please reach out to the support team.',
          },
        },
        confirmation: {
          subject: 'Your Application Confirmation',
          eligible: {
            fcfs: 'Eligible applicants will be contacted on a first come first serve basis until vacancies are filled.',
            lottery:
              'Once the application period closes, eligible applicants will be placed in order based on lottery rank order.',
            waitlist:
              'Eligible applicants will be placed on the waitlist on a first come first serve basis until waitlist spots are filled.',
            waitlistLottery:
              'Eligible applicants will be placed on the waitlist based on lottery rank order.',
            fcfsPreference:
              'Housing preferences, if applicable, will affect first come first serve order.',
            waitlistContact:
              'You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist.',
            waitlistContactAdvocate:
              'Your client may be contacted while on the waitlist to confirm that they wish to remain on the waitlist.',
            lotteryPreference:
              'Housing preferences, if applicable, will affect lottery rank order.',
            waitlistPreference:
              'Housing preferences, if applicable, will affect waitlist order.',
          },
          interview:
            'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents.',
          interviewAdvocate:
            'If your client is contacted for an interview, they will be asked to fill out a more detailed application and provide supporting documents.',
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
          questions: 'Questions?',
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
          gotYourConfirmationNumberOnYourBehalf:
            'We received an application on your behalf for',
        },
        leasingAgent: {
          officeHours: 'Office Hours:',
          propertyManager: 'Property Manager',
          contactAgentToUpdateInfo:
            'If you need to update information on your application, do not apply again. Instead, contact the agent for this listing.',
          contactAgentForQuestions:
            'If you have questions regarding this application, please contact the agent for this listing.',
        },
        mfaCodeEmail: {
          message: 'Access code for your account has been requested.',
          mfaCode: 'Your access code is: %{singleUseCode}',
        },
        forgotPassword: {
          subject: 'Reset your password?',
          resetRequest:
            'We received a request to reset your password for your Bloom Housing Portal account. You must click the following link to complete the reset:',
          ignoreRequest:
            'This password reset is only valid for the next hour. If you didn’t make this request, please ignore this email.',
          changePassword: 'Change my password',
        },
        requestApproval: {
          header: 'Listing approval requested',
          partnerRequest:
            'A Partner has submitted an approval request to publish the %{listingName} listing.',
          fileNumber: 'The listing file number is %{listingFileNumber}.',
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
          header: 'New published listing - %{listingName}',
          adminApproved:
            'The %{listingName} listing has been approved and published by an administrator.',
          viewPublished:
            'To view the published listing, please click on the link below',
        },
        listingScheduled: {
          header: 'New scheduled listing',
          subject: 'New scheduled listing - %{listingName}',
          adminScheduled:
            'The %{listingName} listing has been approved by an administrator and is scheduled to be automatically published on %{date} between 12:00 AM and 2:00 AM. If you have questions or require changes, please contact an administrator.',
        },
        listingPublished: {
          header: 'New published listing',
          subject: 'New published listing - %{listingName}',
          autoPublished:
            'The %{listingName} listing has been automatically published.',
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
            'Use the following code to sign in to your %{jurisdictionName} account. This code will be valid for 10 minutes. Never share this code.',
          singleUseCode: '%{singleUseCode}',
        },
        scriptRunner: {
          information:
            'You previously applied to Fremont Family Apartments, but an error resulted in sending your confirmation email without your confirmation number. Your application number and confirmation number are re-sent below. Thank you for your patience.',
          pleaseSave: 'Please save this email for your records.',
          subject:
            'Your Application Confirmation Number for Fremont Family Apartments',
          yourApplicationNumber: 'Your application number is: %{id}',
          yourConfirmationNumber:
            'Your confirmation number is: %{confirmationCode}',
        },
        lotteryReleased: {
          header:
            'Lottery results for %{listingName} are ready to be published',
          adminApprovedStart:
            'Lottery results for %{listingName} have been released for publication. Please go to the listing view in your',
          adminApprovedEnd:
            'to view the lottery tab and release the lottery results.',
        },
        lotteryPublished: {
          header: 'Lottery results have been published for %{listingName}',
          resultsPublished:
            'Lottery results for %{listingName} have been published to applicant accounts.',
        },
        lotteryAvailable: {
          header: 'New Housing Lottery Results Available',
          duplicatesDetails:
            'Bloom generally does not accept duplicate applications. A duplicate application is one that has someone who also appears on another application for the same housing opportunity. For more detailed information on how we handle duplicates, see our',
          otherOpportunities1:
            'To view other housing opportunities, please visit %{appUrl}. You can sign up to receive notifications of new application opportunities',
          otherOpportunities2: 'here',
          otherOpportunities3:
            'If you want to learn about how lotteries work, please see the lottery section of the',
          otherOpportunities4: 'Housing Portal Help Center',
          resultsAvailable:
            'Results are available for a housing lottery for %{listingName}. See your housing portal account for more information.',
          signIn: 'Sign In to View Your Results',
          termsOfUse: 'Terms of Use',
          whatHappensHeader: 'What happens next?',
          whatHappensContent:
            'The property manager will begin to contact applicants in the order of lottery rank, within each lottery preference. When the units are all filled, the property manager will stop contacting applicants. All the units could be filled before the property manager reaches your rank. If this happens, you will not be contacted.',
          termsUrl: 'https://www.exygy.com',
          helpCenterUrl: 'https://www.exygy.com',
          notificationsUrl: 'https://www.exygy.com',
        },
        accountRemoval: {
          subject: 'Bloom Housing Scheduled Account Removal Due to Inactivity',
          courtesyText1:
            'This is a courtesy email to let you know that because your Bloom Housing Portal account has been inactive for 3 years, your account will be deleted in 30 days per our',
          courtesyText2:
            'If you’d like to keep your account, please log in anytime in the next month and we’ll consider your account active again.',
          signIn: 'Sign in to Bloom Housing',
          privacyPolicy: 'Privacy Policy',
          privacyPolicyUrl: 'localhost:3000/privacy-policy',
        },
        rentalOpportunity: {
          subject: 'New rental opportunity at %{listingName}',
          intro: 'Rental opportunity at',
          comingSoon: {
            subject: 'Coming soon - %{listingName}',
            intro: 'Coming soon',
          },
          community: 'Community',
          communityType: {
            developmentalDisability: 'Developmental disability',
            farmworkerHousing: 'Farmworker housing',
            housingVoucher: 'HCV/Section 8 Voucher',
            referralOnly: 'Referral only',
            schoolEmployee: 'School employee',
            senior: 'Seniors',
            senior55: 'Seniors 55+',
            senior62: 'Seniors 62+',
            specialNeeds: 'Special needs',
            tay: 'TAY - Transition aged youth',
            veteran: 'Veteran',
          },
          applicationsDue: 'Applications Due',
          applicationsOpen: 'Applications Open',
          address: 'Address',
          neighborhood: 'Neighborhood',
          region: 'Region',
          unitType: 'Available accessible units',
          accessibilityType: {
            hearing: 'Hearing',
            mobility: 'Mobility',
            vision: 'Vision',
            hearingAndVision: 'Hearing/Vision',
            mobilityAndHearing: 'Mobility and Hearing',
            mobilityAndVision: 'Mobility and Vision',
            mobilityHearingAndVision: 'Mobility and Hearing/Vision',
          },
          opportunityType: 'Opportunity type',
          lottery: 'Lottery',
          waitlist: 'Waitlist',
          unitTypes: {
            SRO: 'SRO',
            studio: 'Studio',
            oneBdrm: '1 bedroom',
            twoBdrm: '2 bedroom',
            threeBdrm: '3 bedroom',
            fourBdrm: '4 bedroom',
            fiveBdrm: '5 bedroom',
          },
          unitCount: '%{smart_count} unit |||| %{smart_count} units',
          bathCount: '%{smart_count} bath |||| %{smart_count} baths',
          rent: 'Rent',
          sqft: 'sqft',
          minIncome: 'Minimum Income',
          maxIncome: 'Maximum Income',
          perMonth: 'per month',
          ofIncome: 'of income',
          orUpTo: 'or up to',
          lotteryDate: 'Lottery Date',
          viewListingNotice: {
            line1: 'THIS INFORMATION MAY CHANGE',
            line2: 'Please view listing for the most updated information',
          },
          viewButton: {
            en: 'View listing & apply',
            es: 'Ver listado y aplicar',
            zh: '查看列表并申请',
            vi: 'Xem danh sách và áp dụng',
            tl: 'Tingnan ang listahan at mag-apply',
            bn: 'তালিকা দেখুন এবং আবেদন করুন',
            ar: 'عرض القائمة والتقديم',
            fa: 'مشاهده لیست و اعمال',
            hy: 'Դիտեք ցուցակը և կիրառեք',
            ko: '목록 보기 및 신청',
          },
          footer: {
            accessibleMarketingFlyer: 'Accessible marketing flyer',
            unsubscribeAndEmailSettings:
              'Unsubscribe and manage email settings',
          },
        },
        advocateApproved: {
          subject: 'Your account has been approved',
          hello: 'Hello',
          approvalMessage: 'Your account at %{appUrl} has been approved.',
          approvalInfo:
            'It will now be easier for you to start, save, and submit online applications <strong>on behalf of housing applicants</strong> for listings that appear on the site.',
          completeMessage:
            'To complete your account creation, please click the link below:',
          createAccount: 'Create my account',
        },
        advocateRejected: {
          subject: 'Update about your account request',
          hello: 'Hello',
          rejectionMessageStart:
            'Thank you for your interest in creating an account on %{appUrl}.',
          rejectionMessageEnd:
            'We are not able to approve your account at this time.',
          rejectionInfoStart:
            'If you believe this decision was made in error or have questions about eligibility, please contact us at',
          rejectionInfoEnd: 'for more information.',
        },
      };
  }
};

const flatten = (
  tree: Record<string, unknown>,
  prefix = '',
): TranslationRow[] =>
  Object.entries(tree ?? {}).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object'
      ? flatten(value as Record<string, unknown>, path)
      : [{ key: path, value: String(value) }];
  });

// Only English is complete; every other language fills in the subset it has translated.
export const baseTranslationRows = (
  language: LanguagesEnum,
): TranslationRow[] =>
  flatten(translations(undefined, language) as Record<string, unknown>);

export const jurisdictionTranslationRows = (
  jurisdiction: { id: string; name: string },
  language?: LanguagesEnum,
): TranslationRow[] =>
  flatten(translations(jurisdiction, language) as Record<string, unknown>);
