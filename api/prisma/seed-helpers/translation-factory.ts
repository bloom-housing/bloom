import { LanguagesEnum, Prisma } from '@prisma/client';

const translations = (
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
          header: 'Nuevos resultados de la lotería de vivienda disponibles',
          resultsAvailable:
            'Los resultados están disponibles para una lotería de vivienda para %{listingName}. Consulte su cuenta del portal de vivienda para obtener más información.',
          signIn: 'Inicie sesión para ver sus resultados',
          whatHappensHeader: '¿Qué pasa después?',
          whatHappensContent:
            'El administrador de la propiedad comenzará a comunicarse con los solicitantes en el orden de clasificación de la lotería, dentro de cada preferencia de la lotería. Cuando todas las unidades estén ocupadas, el administrador de la propiedad dejará de comunicarse con los solicitantes. Es posible que todas las unidades estén ocupadas antes de que el administrador de la propiedad alcance su clasificación. Si esto sucede, no se comunicarán con usted.',
          otherOpportunities1:
            'Para ver otras oportunidades de vivienda, visite %{appUrl}. Puede registrarse para recibir notificaciones de nuevas oportunidades de solicitud',
          otherOpportunities2: 'aquí',
          otherOpportunities3:
            'Si desea obtener información sobre cómo funcionan las loterías, consulte la sección de lotería del',
          otherOpportunities4: 'Housing Portal Centro de ayuda',
        },
        accountRemoval: {
          subject:
            'Eliminación programada de cuenta de Bloom Housing debido a inactividad',
          courtesyText:
            'Este es un correo electrónico de cortesía para informarle que, debido a que su cuenta del Portal de Bloom Housing ha estado inactiva durante 3 años, se eliminará en 30 días según nuestros Términos de Uso y Política de Privacidad. Si desea conservar su cuenta, inicie sesión durante el próximo mes y la consideraremos activa de nuevo.',
          signIn: 'Iniciar sesión en Bloom Housing',
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
        rentalOpportunity: {
          subject: 'Nueva oportunidad de alquiler en %{listingName}',
          intro: 'Oportunidad de alquiler en',
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
          address: 'Dirección',
          neighborhood: 'Vecindario',
          unitType: 'Tipo de unidad',
          accessibilityType: {
            hearing: 'Auditiva',
            mobility: 'Movilidad',
            vision: 'Visual',
            hearingAndVision: 'Auditiva y visual',
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
            unsubscribe: 'Cancelar suscripción',
            emailSettings: 'Configuración de correo electrónico',
          },
        },
      };
    case LanguagesEnum.vi:
      return {
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
        rentalOpportunity: {
          subject: 'Cơ hội thuê nhà mới tại %{listingName}',
          intro: 'Cơ hội thuê nhà tại',
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
          address: 'Địa chỉ',
          neighborhood: 'Khu phố',
          unitType: 'Loại căn hộ',
          accessibilityType: {
            hearing: 'Thính giác',
            mobility: 'Di chuyển',
            vision: 'Thị giác',
            hearingAndVision: 'Thính giác và thị giác',
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
            unsubscribe: 'Hủy đăng ký',
            emailSettings: 'Cài đặt email',
          },
        },
      };
    case LanguagesEnum.zh:
      return {
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
        rentalOpportunity: {
          subject: '新租赁机会：%{listingName}',
          intro: '租赁机会，地点：',
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
          address: '地址',
          neighborhood: '街区',
          unitType: '单元类型',
          accessibilityType: {
            hearing: '听力',
            mobility: '行动',
            vision: '视力',
            hearingAndVision: '听力和视力',
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
            unsubscribe: '取消订阅',
            emailSettings: '电子邮件设置',
          },
        },
      };
    case LanguagesEnum.tl:
      return {
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
        rentalOpportunity: {
          subject: 'Bagong pagkakataon sa pag-upa sa %{listingName}',
          intro: 'Pagkakataon sa pag-upa sa',
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
          address: 'Address',
          neighborhood: 'Kapitbahayan',
          unitType: 'Uri ng unit',
          accessibilityType: {
            hearing: 'Pandinig',
            mobility: 'Mobilidad',
            vision: 'Paningin',
            hearingAndVision: 'Pandinig at paningin',
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
            unsubscribe: 'Mag-unsubscribe',
            emailSettings: 'Mga setting ng email',
          },
        },
      };
    case LanguagesEnum.bn:
      return {
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
        rentalOpportunity: {
          subject: '%{listingName}-এ নতুন ভাড়ার সুযোগ',
          intro: 'ভাড়ার সুযোগ:',
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
          address: 'ঠিকানা',
          neighborhood: 'এলাকা',
          unitType: 'ইউনিটের ধরন',
          accessibilityType: {
            hearing: 'শ্রবণ',
            mobility: 'গতিশীলতা',
            vision: 'দৃষ্টি',
            hearingAndVision: 'শ্রবণ ও দৃষ্টি',
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
            unsubscribe: 'আনসাবস্ক্রাইব',
            emailSettings: 'ইমেইল সেটিংস',
          },
        },
      };
    case LanguagesEnum.ar:
      return {
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
        rentalOpportunity: {
          subject: 'فرصة إيجار جديدة في %{listingName}',
          intro: 'فرصة إيجار في',
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
          address: 'العنوان',
          neighborhood: 'الحي',
          unitType: 'نوع الوحدة',
          accessibilityType: {
            hearing: 'السمع',
            mobility: 'الحركة',
            vision: 'البصر',
            hearingAndVision: 'السمع والبصر',
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
            unsubscribe: 'إلغاء الاشتراك',
            emailSettings: 'إعدادات البريد الإلكتروني',
          },
        },
      };
    case LanguagesEnum.ko:
      return {
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
        rentalOpportunity: {
          subject: '%{listingName}의 새로운 임대 기회',
          intro: '임대 기회 위치:',
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
          address: '주소',
          neighborhood: '동네',
          unitType: '유닛 유형',
          accessibilityType: {
            hearing: '청각',
            mobility: '이동성',
            vision: '시각',
            hearingAndVision: '청각 및 시각',
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
            unsubscribe: '구독 취소',
            emailSettings: '이메일 설정',
          },
        },
      };
    case LanguagesEnum.hy:
      return {
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
        rentalOpportunity: {
          subject: 'Նոր վարձակալության հնարավորություն՝ %{listingName}',
          intro: 'Վարձակալության հնարավորություն',
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
          address: 'Հասցե',
          neighborhood: 'Թաղամաս',
          unitType: 'Բնակարանի տեսակ',
          accessibilityType: {
            hearing: 'Լսողություն',
            mobility: 'Շարժունակություն',
            vision: 'Տեսողություն',
            hearingAndVision: 'Լսողություն և տեսողություն',
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
            unsubscribe: 'Դուրս գալ բաժանորդագրությունից',
            emailSettings: 'Էլ. փոստի կարգավորումներ',
          },
        },
      };
    case LanguagesEnum.fa:
      return {
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
        rentalOpportunity: {
          subject: 'فرصت اجاره جدید در %{listingName}',
          intro: 'فرصت اجاره در',
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
          address: 'آدرس',
          neighborhood: 'محله',
          unitType: 'نوع واحد',
          accessibilityType: {
            hearing: 'شنوایی',
            mobility: 'تحرک',
            vision: 'بینایی',
            hearingAndVision: 'شنوایی و بینایی',
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
            unsubscribe: 'لغو اشتراک',
            emailSettings: 'تنظیمات ایمیل',
          },
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
          subject: 'Forgot your password?',
          callToAction:
            'If you did make this request, please click on the link below to reset your password:',
          passwordInfo:
            "Your password won't change until you access the link above and create a new one.",
          resetRequest:
            'A request to reset your Bloom Housing Portal website password for %{appUrl} has recently been made.',
          ignoreRequest:
            "If you didn't request this, please ignore this email.",
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
          resultsAvailable:
            'Results are available for a housing lottery for %{listingName}. See your housing portal account for more information.',
          signIn: 'Sign In to View Your Results',
          whatHappensHeader: 'What happens next?',
          whatHappensContent:
            'The property manager will begin to contact applicants in the order of lottery rank, within each lottery preference. When the units are all filled, the property manager will stop contacting applicants. All the units could be filled before the property manager reaches your rank. If this happens, you will not be contacted.',
          otherOpportunities1:
            'To view other housing opportunities, please visit %{appUrl}. You can sign up to receive notifications of new application opportunities',
          otherOpportunities2: 'here',
          otherOpportunities3:
            'If you want to learn about how lotteries work, please see the lottery section of the',
          otherOpportunities4: 'Housing Portal Help Center',
        },
        accountRemoval: {
          subject: 'Bloom Housing Scheduled Account Removal Due to Inactivity',
          courtesyText:
            'This is a courtesy email to let you know that because your Bloom Housing Portal account has been inactive for 3 years, your account will be deleted in 30 days per our Terms of Use and Privacy Policy. If you’d like to keep your account, please log in sometime in the next month and we’ll consider your account active again.',
          signIn: 'Sign in to Bloom Housing',
        },
        rentalOpportunity: {
          subject: 'New rental opportunity at %{listingName}',
          intro: 'Rental opportunity at',
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
          address: 'Address',
          neighborhood: 'Neighborhood',
          unitType: 'Unit type',
          accessibilityType: {
            hearing: 'Hearing',
            mobility: 'Mobility',
            vision: 'Vision',
            hearingAndVision: 'Hearing and Vision',
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
            unsubscribe: 'Unsubscribe',
            emailSettings: 'Email settings',
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

export const translationFactory = (optionalParams?: {
  jurisdiction?: {
    id: string;
    name: string;
  };
  language?: LanguagesEnum;
}): Prisma.TranslationsCreateInput => {
  return {
    language: optionalParams?.language || LanguagesEnum.en,
    translations: translations(
      optionalParams?.jurisdiction,
      optionalParams?.language,
    ),
    jurisdictions: optionalParams?.jurisdiction
      ? {
          connect: {
            id: optionalParams.jurisdiction.id,
          },
        }
      : undefined,
  };
};
