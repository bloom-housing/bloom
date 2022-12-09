import { MigrationInterface, QueryRunner } from "typeorm"

export class multiselectTranslationFix1666583981588 implements MigrationInterface {
  name = "multiselectTranslationFix1666583981588"

  // construct translation object for multiselect questions
  translations = {
    en: [
      {
        options: ["Live in %{county} County Preference", "Work in %{county} County Preference"],
        text: "Live or Work in City of Hayward",
        opt_out_text: null,
      },
      {
        options: [
          "At least one member of my household lives in Dublin (3 points)",
          "At least one member of my household has an immediate family member in Dublin (1 point)",
          "At least one member of my household was required to relocate from current Dublin residence due to demolition of dwelling or conversation of dwelling from rental to for-sale unit (1 point)",
          "At least one member of my household works full-time in Dublin (3 points)",
          "At least one member of my household is a public service employee in Dublin (1 additional point)",
          "At least one member of my household is permanently disabled (1 point)",
          "At least one member of my household is a senior, defined as age 62 and older (1 point)",
          "Someone in my household has served in the U.S. military (1 point)",
        ],
        text: "City of Dublin Housing Preferences",
        opt_out_text: null,
      },
      {
        options: ["Neighborhood Residents Preference"],
        text: "Neighborhood Residents",
        opt_out_text: null,
      },
      {
        options: [
          "Live in the City of Oakland Preference",
          "Work in the City of Oakland Preference",
        ],
        text: "Live/Work in Oakland",
        opt_out_text: null,
      },
      {
        options: ["Displacee Tenant Housing Preference", "Mission Corridor"],
        text:
          "Displacee Tenant or Mission Boulevard Corridor (SR 238) Displacee Tenant Housing Preference",
        opt_out_text: null,
      },
      {
        options: ["Housing Opportunities for Persons with AIDS"],
        text: "Housing Opportunities for Persons with AIDS",
        opt_out_text: "I don't want to be considered",
      },
      {
        options: ["Berkeley Housing Authority Project Based Voucher Section 8 apartments"],
        text: "Berkeley Housing Authority Apartments",
        opt_out_text: "I don't want to be considered",
      },
      {
        options: [
          "Yes, I am registered with an organization that supports developmental disabilities",
          "No, I am not registered with an organization that supports developmental disabilities",
        ],
        text: "Developmental Disability Registration",
        opt_out_text:
          "I don't know if I am registered with an organization that supports developmental disabilities",
      },
      {
        options: [
          "Residency",
          "Family",
          "Veteran",
          "Homeless",
          "None of these preferences apply to me, but I would like to be considered",
        ],
        text: "OAKLAND HOUSING AUTHORITY PROJECT-BASED VOUCHER",
        opt_out_text:
          "I don't want to be considered for Oakland Housing Authority project-based voucher units",
      },
      {
        options: [
          "Live in the City of Alameda Preference",
          "Work in the City of Alameda Preference",
        ],
        text: "Live/Work in City of Alameda",
        opt_out_text: null,
      },
      {
        options: [
          "Live in the Tri-Valley Area Preference",
          "Work in the Tri-Valley Area (Dublin, Livermore, Pleasanton) Preference",
        ],
        text: "Live/Work in Tri-Valley Area",
        opt_out_text: null,
      },
      {
        options: [
          "Yes, I or someone in my household has a developmental disability",
          "No, no one in my household has a developmental disability",
        ],
        text: "Developmental Disability",
        opt_out_text: "I don't know if someone in my household has a developmental disability",
      },
      {
        options: [
          "At least one member of my household was a previous resident of Rosefield Village",
        ],
        text: "Previous Residents of Rosefield Village Relocated Outside of the City of Alameda",
        opt_out_text: null,
      },
      {
        options: [
          "At least one member of my household is an Alameda Unified School District employee",
        ],
        text: "Alameda Unified School District (AUSD) employee",
        opt_out_text: null,
      },
      {
        options: [
          "Live in the City of Livermore Preference",
          "Work in the City of Livermore Preference",
        ],
        text: "Live/Work in Livermore",
        opt_out_text: null,
      },
      {
        options: [
          "Terminated due to Insufficient funding",
          "Withdrawn Voucher due to Insufficient funding",
          "Existing Participant Emergency Transfer Preference",
          "Homeless",
          "Displaced Family Preference",
          "Residency Preference",
          "Working Preference",
          "Veteran’s Preference",
          "None of these preferences apply, but I still want to be considered for the PBV units",
          "Do not consider me for the PBV units",
          "I only want to be considered for the PBV units",
        ],
        text: "Livermore Housing Authority Preferences for Project-Based Voucher Units",
        opt_out_text: null,
      },
      {
        options: ["Displaced Household Preference"],
        text: "Oakland Displaced Household",
        opt_out_text: null,
      },
      {
        options: [
          "At least one member of my household is subject to termination of affordability restrictions",
        ],
        text: "Persons subject to termination of affordability restrictions",
        opt_out_text: null,
      },
      {
        options: [
          "At least one member of my household lives in Foster City",
          "At least one member of my household works in Foster City",
        ],
        text: "Live and work in Foster City",
        opt_out_text: null,
      },
      {
        options: ["At least one member of my household lives in Foster City"],
        text: "Live in Foster City",
        opt_out_text: null,
      },
      {
        options: ["At least one member of my household is an employee of the City of Foster City"],
        text: "City of Foster City Employees",
        opt_out_text: null,
      },
      {
        options: ["At least one member of my household is a school district employee"],
        text: "School District Employees",
        opt_out_text: null,
      },
      {
        options: ["At least one member of my household works in Foster City"],
        text: "Work in Foster City",
        opt_out_text: null,
      },
      {
        options: [
          "At least one member of my household lives in the City of San Mateo",
          "At least one member of my household works in the City of San Mateo",
        ],
        text: "Live or work in the City of San Mateo",
        opt_out_text: null,
      },
      {
        options: [
          "At least one member of my household lives in the City of East Palo Alto",
          "At least one member of my household works 20 hours per week or more in the City of East Palo Alto",
        ],
        text: "Live or work in the City of East Palo Alto",
        opt_out_text: null,
      },
      {
        options: [
          "Natural Disaster declared by Governor",
          "Domestic Violence",
          "City Code Enforcement Activity",
          'A "No Fault" Eviction from a rental unit in East Palo Alto within the last year of this application',
          "A 10% or higher increase in rent in the last 12 months",
        ],
        text: "Involuntary Displacement from East Palo Alto",
        opt_out_text: null,
      },
      {
        options: ["Live or Work", "Family", "Veteran"],
        text: "Oakland Housing Authority Preferences",
        opt_out_text: null,
      },
      {
        options: [
          "Live in Fremont: At least one member of my household lives* in the City of Fremont",
          "Work in Fremont: At least one member of my household works** in the City of Fremont",
        ],
        text: "City of Fremont Preferences",
        opt_out_text: null,
      },
      {
        options: [
          "At least one member of my household lives in the Emeryville",
          "At least one member of my household works at least 50% of weekly hours in Emeryville",
          "I have a child enrolled in the Emeryville Unified School District (EUSD) or Emeryville Child Development Center (ECDC)",
        ],
        text: "City of Emeryville Housing Preferences",
        opt_out_text: null,
      },
      {
        options: ["Live in Fremont, Newark or Union City", "Work in Fremont, Newark or Union City"],
        text: "South Alameda County Region Housing Preferences",
        opt_out_text: null,
      },
      {
        options: ["Yes", "No"],
        text: "Veteran",
        opt_out_text: "Prefer not to say",
      },
      {
        options: ["Yes", "No"],
        text: "Transition Age Youth",
        opt_out_text: "Prefer not to say",
      },
      {
        options: ["Yes", "No"],
        text: "Developmental Disability",
        opt_out_text: "Prefer not to say",
      },
      {
        options: ["I have somewhere to stay, but it isn't permanent", "I'm homeless", "No"],
        text: "Housing Situation",
        opt_out_text: "Prefer not to say",
      },
      {
        options: [
          "Affordable apartment with flat rent",
          "Project based affordable apartments with a rent at 30% of your income",
        ],
        text: "Flat Rent & Rent Based on Income",
        opt_out_text: null,
      },
      {
        options: ["Veteran", "Veteran Status"],
        text: "State of California - Veterans Housing and Homelessness Prevention Program (VHHP)",
        opt_out_text: null,
      },
      {
        options: ["I'm interested"],
        text: "Housing Opportunities for Persons with AIDS (HOPWA)",
        opt_out_text: "I'm not interested",
      },
      {
        options: [
          "Yes, I am a City of San Mateo Registered Renter ",
          "No, I am not a City of San Mateo Registered Renter ",
        ],
        text: "City of San Mateo Registered Renter",
        opt_out_text: "I don't want this preference",
      },
      {
        options: ["At least one member of my household is an employee of the City of Foster City"],
        text: "City of Foster City Employees",
        opt_out_text: null,
      },
      {
        options: [
          "Live in Alameda County Preference",
          "Work in Alameda County Preference",
          "Work in Alameda County Preference",
        ],
        text: "Live/Work in Alameda County",
        opt_out_text: null,
      },
      {
        options: ["Live in Alameda County Preference", "Work in Alameda County Preference"],
        text: "Live/Work in Alameda County",
        opt_out_text: null,
      },
      {
        options: ["I'm interested"],
        text: "Housing Opportunities for Persons with AIDS (HOPWA)",
        opt_out_text: "I'm not interested",
      },
      {
        options: ["Live or Work", "Family", "Veteran"],
        text: "Oakland Housing Authority Preferences",
        opt_out_text: null,
      },
    ],
    es: [
      {
        options: ["Vive en %{county} County Preference", "Trabaja en %{county} County Preference"],
        text: "Vive o trabaja en la ciudad de Hayward",
        opt_out_text: null,
      },
      {
        options: [
          "Al menos un miembro de mi hogar vive en Dublín (3 puntos)",
          "Al menos un miembro de mi hogar tiene un familiar directo en Dublín (1 punto)",
          "Se requirió que al menos un miembro de mi hogar se mudara de la residencia actual en Dublín debido a la demolición de la vivienda o la conversión de la vivienda de alquiler a unidad de venta (1 punto)",
          "Al menos un miembro de mi hogar trabaja a tiempo completo en Dublín (3 puntos)",
          "Al menos un miembro de mi hogar es un empleado del servicio público en Dublín (1 punto adicional)",
          "Al menos un miembro de mi hogar tiene una discapacidad permanente (1 punto)",
          "Al menos un miembro de mi hogar es una persona mayor, definida como de 62 años o más (1 punto)",
          "Alguien en mi hogar ha servido en el ejército de los EE. UU. (1 punto)",
        ],
        text: "Preferencias de vivienda de la ciudad de Dublín",
        opt_out_text: null,
      },
      {
        options: ["Preferencia de los residentes del vecindario"],
        text: "Residentes del vecindario",
        opt_out_text: null,
      },
      {
        options: [
          "Vivir en la preferencia de la ciudad de Oakland",
          "Trabajar en la preferencia de la ciudad de Oakland",
        ],
        text: "Vivir/Trabajar en Oakland",
        opt_out_text: null,
      },
      {
        options: ["Preferencia de vivienda para inquilinos desplazados", "Corredor de la misión"],
        text:
          "Inquilino desplazado o Mission Boulevard Corridor (SR 238) Preferencia de vivienda para inquilinos desplazados",
        opt_out_text: null,
      },
      {
        options: ["Oportunidades de vivienda para personas con SIDA"],
        text: "Oportunidades de vivienda para personas con SIDA",
        opt_out_text: "No quiero ser considerado",
      },
      {
        options: [
          "Apartamentos de la Sección 8 de cupones basados ​​en proyectos de la Autoridad de Vivienda de Berkeley",
        ],
        text: "Apartamentos de la Autoridad de Vivienda de Berkeley",
        opt_out_text: "No quiero ser considerado",
      },
      {
        options: [
          "Sí, estoy registrado en una organización que apoya las discapacidades del desarrollo",
          "No, no estoy registrado en una organización que apoye las discapacidades del desarrollo",
        ],
        text: "Registro de discapacidad del desarrollo",
        opt_out_text:
          "No sé si estoy registrado en una organización que apoya las discapacidades del desarrollo",
      },
      {
        options: [
          "Residencia",
          "Familia",
          "Veterano",
          "Sin hogar",
          "Ninguna de estas preferencias se aplica a mí, pero me gustaría ser considerado",
        ],
        text: "VALE BASADO EN PROYECTO DE LA AUTORIDAD DE VIVIENDA DE OAKLAND",
        opt_out_text:
          "No quiero ser considerado para unidades de vales basadas en proyectos de la Autoridad de Vivienda de Oakland",
      },
      {
        options: [
          "Vive en la Ciudad de Preferencia Alameda",
          "Trabajar en la Ciudad de Preferencia de Alameda",
        ],
        text: "Vive/Trabaja en la Ciudad de Alameda",
        opt_out_text: null,
      },
      {
        options: [
          "Vive en la preferencia del área de Tri-Valley",
          "Preferencia de trabajo en el área de Tri-Valley (Dublín, Livermore, Pleasanton)",
        ],
        text: "Vive/Trabaja en el área de Tri-Valley",
        opt_out_text: null,
      },
      {
        options: [
          "Sí, yo o alguien en mi hogar tiene una discapacidad del desarrollo",
          "No, nadie en mi hogar tiene una discapacidad del desarrollo",
        ],
        text: "Discapacidad del desarrollo",
        opt_out_text: "No sé si alguien en mi hogar tiene una discapacidad del desarrollo",
      },
      {
        options: ["Al menos un miembro de mi hogar fue residente anterior de Rosefield Village"],
        text: "Residentes anteriores de Rosefield Village reubicados fuera de la ciudad de Alameda",
        opt_out_text: null,
      },
      {
        options: [
          "Al menos un miembro de mi hogar es empleado del Distrito Escolar Unificado de Alameda",
        ],
        text: "Empleado del Distrito Escolar Unificado de Alameda (AUSD)",
        opt_out_text: null,
      },
      {
        options: [
          "Vive en la ciudad de preferencia de Livermore",
          "Trabajar en la Preferencia de la Ciudad de Livermore",
        ],
        text: "Vivir/Trabajar en Livermore",
        opt_out_text: null,
      },
      {
        options: [
          "Terminado debido a fondos insuficientes",
          "Bono retirado por insuficiencia de fondos",
          "Preferencia de transferencia de emergencia del participante existente",
          "Sin hogar",
          "Preferencia de Familia Desplazada",
          "Preferencia de Residencia",
          "Preferencia de trabajo",
          "Preferencia de Veterano",
          "Ninguna de estas preferencias aplica, pero aun así quiero ser considerado para las unidades PBV",
          "No me consideren para las unidades PBV",
          "Solo quiero ser considerado para las unidades PBV",
        ],
        text:
          "Preferencias de la Autoridad de Vivienda de Livermore para unidades de vales basadas en proyectos",
        opt_out_text: null,
      },
      {
        options: ["Preferencia de hogar desplazado"],
        text: "Hogar desplazado de Oakland",
        opt_out_text: null,
      },
      {
        options: [
          "Al menos un miembro de mi hogar está sujeto a la terminación de las restricciones de asequibilidad",
        ],
        text: "Personas sujetas a terminación de restricciones de asequibilidad",
        opt_out_text: null,
      },
      {
        options: [
          "Al menos un miembro de mi hogar vive en Foster City",
          "Al menos un miembro de mi hogar trabaja en Foster City",
        ],
        text: "Vive y trabaja en Foster City",
        opt_out_text: null,
      },
      {
        options: ["Al menos un miembro de mi hogar vive en Foster City"],
        text: "Vive en Foster City",
        opt_out_text: null,
      },
      {
        options: ["Al menos un miembro de mi hogar es un empleado de la Ciudad de Foster City"],
        text: "Empleados de la ciudad de Foster City",
        opt_out_text: null,
      },
      {
        options: ["Al menos un miembro de mi hogar es un empleado del distrito escolar"],
        text: "Empleados del distrito escolar",
        opt_out_text: null,
      },
      {
        options: ["Al menos un miembro de mi hogar trabaja en Foster City"],
        text: "Trabajar en Foster City",
        opt_out_text: null,
      },
      {
        options: [
          "Al menos un miembro de mi hogar vive en la Ciudad de San Mateo",
          "Al menos un miembro de mi hogar trabaja en la Ciudad de San Mateo",
        ],
        text: "Vivir o trabajar en la Ciudad de San Mateo",
        opt_out_text: null,
      },
      {
        options: [
          "Al menos un miembro de mi hogar vive en la ciudad de East Palo Alto",
          "Al menos un miembro de mi hogar trabaja 20 horas por semana o más en la ciudad de East Palo Alto",
        ],
        text: "Vive o trabaja en la ciudad de East Palo Alto",
        opt_out_text: null,
      },
      {
        options: [
          "Desastre Natural declarado por Gobernador",
          "Violencia doméstica",
          "Actividad de cumplimiento del código de la ciudad",
          'Un desalojo "sin culpa" de una unidad de alquiler en East Palo Alto dentro del último año de esta solicitud',
          "Un aumento del 10% o más en la renta en los últimos 12 meses",
        ],
        text: "Desplazamiento involuntario de East Palo Alto",
        opt_out_text: null,
      },
      {
        options: ["Vive o trabaja", "Familia", "Veterano"],
        text: "Preferencias de la Autoridad de Vivienda de Oakland",
        opt_out_text: null,
      },
      {
        options: [
          "Vivo en Fremont: Al menos un miembro de mi hogar vive* en la ciudad de Fremont",
          "Trabajo en Fremont: Al menos un miembro de mi hogar trabaja** en la Ciudad de Fremont",
        ],
        text: "Preferencias de la ciudad de Fremont",
        opt_out_text: null,
      },
      {
        options: [
          "Al menos un miembro de mi hogar vive en Emeryville",
          "Al menos un miembro de mi hogar trabaja al menos el 50% de las horas semanales en Emeryville",
          "Tengo un hijo inscrito en el Distrito Escolar Unificado de Emeryville (EUSD) o en el Centro de Desarrollo Infantil de Emeryville (ECDC)",
        ],
        text: "Preferencias de vivienda de la ciudad de Emeryville",
        opt_out_text: null,
      },
      {
        options: [
          "Vive en Fremont, Newark o Union City",
          "Trabajar en Fremont, Newark o Union City",
        ],
        text: "Preferencias de vivienda de la región del condado de South Alameda",
        opt_out_text: null,
      },
      {
        options: ["Sí", "No"],
        text: "Veterano",
        opt_out_text: "Prefiero no decirlo",
      },
      {
        options: ["Sí", "No"],
        text: "Jóvenes en edad de transición",
        opt_out_text: "Prefiero no decirlo",
      },
      {
        options: ["Sí", "No"],
        text: "Discapacidad del desarrollo",
        opt_out_text: "Prefiero no decirlo",
      },
      {
        options: ["Tengo un lugar donde quedarme, pero no es permanente", "No tengo hogar", "No"],
        text: "Situación de la vivienda",
        opt_out_text: "Prefiero no decirlo",
      },
      {
        options: [
          "Apartamento asequible con alquiler plano",
          "Apartamentos asequibles basados ​​en proyectos con un alquiler del 30% de sus ingresos",
        ],
        text: "Alquiler fijo y alquiler en función de los ingresos",
        opt_out_text: null,
      },
      {
        options: ["Veterano", "estatus de veterano"],
        text:
          "Estado de California - Programa de prevención de viviendas y personas sin hogar para veteranos (VHHP)",
        opt_out_text: null,
      },
      {
        options: ["Estoy interesado"],
        text: "Oportunidades de Vivienda para Personas con SIDA (HOPWA)",
        opt_out_text: "No me interesa",
      },
      {
        options: [
          "Sí, soy un inquilino registrado de la ciudad de San Mateo",
          "No, no soy un inquilino registrado de la ciudad de San Mateo",
        ],
        text: "Inquilino registrado de la ciudad de San Mateo",
        opt_out_text: "No quiero esta preferencia",
      },
      {
        options: ["Al menos un miembro de mi hogar es un empleado de la Ciudad de Foster City"],
        text: "Empleados de la ciudad de Foster City",
        opt_out_text: null,
      },
      {
        options: [
          "Vivir en la preferencia del condado de Alameda",
          "Preferencia de trabajo en el condado de Alameda",
        ],
        text: "Vivir/Trabajar en el Condado de Alameda",
        opt_out_text: null,
      },
      {
        options: [
          "Preferencia para vivir en el condado de Alameda",
          "Preferencia para trabajar en el condado de Alameda",
        ],
        text: "Vive/Trabaja en el condado de Alameda",
        opt_out_text: null,
      },
    ],
    vi: [
      {
        options: ["Sống ở% {hạt} Sở thích của Hạt", "Làm việc ở% {Hạt} Sở thích của Hạt"],
        text: "Sống hoặc Làm việc ở Thành phố Hayward",
        opt_out_text: null,
      },
      {
        options: [
          "Ít nhất một thành viên trong gia đình tôi sống ở Dublin (3 điểm)",
          "Ít nhất một thành viên trong gia đình của tôi có người thân trong gia đình ở Dublin (1 điểm)",
          "Ít nhất một thành viên trong gia đình tôi đã phải di dời khỏi nơi cư trú hiện tại ở Dublin do việc phá dỡ nhà ở hoặc chuyển nhà từ cho thuê sang bán (1 điểm)",
          "Ít nhất một thành viên trong gia đình tôi làm việc toàn thời gian ở Dublin (3 điểm)",
          "Ít nhất một thành viên trong gia đình tôi là nhân viên dịch vụ công cộng ở Dublin (1 điểm bổ sung)",
          "Ít nhất một thành viên trong gia đình tôi bị tàn tật vĩnh viễn (1 điểm)",
          "Ít nhất một thành viên trong gia đình tôi là người cao tuổi, được xác định là từ 62 tuổi trở lên (1 điểm)",
          "Một người nào đó trong gia đình tôi đã phục vụ trong quân đội Hoa Kỳ (1 điểm)",
        ],
        text: "Sở thích về Nhà ở của Thành phố Dublin",
        opt_out_text: null,
      },
      {
        options: ["Ưu tiên Cư dân Vùng lân cận"],
        text: "Cư dân vùng lân cận",
        opt_out_text: null,
      },
      {
        options: [
          "Sống trong Sở thích của Thành phố Oakland",
          "Làm việc tại Thành phố Oakland Preference",
        ],
        text: "Sống / Làm việc tại Oakland",
        opt_out_text: null,
      },
      {
        options: ["Sở thích Nhà ở cho Người thuê Thay thế", "Hành lang Sứ mệnh"],
        text:
          "Người Thuê nhà Di dời hoặc Hành lang Đại lộ Mission (SR 238) Sở thích Nhà ở cho Người thuê nhà Di dời",
        opt_out_text: null,
      },
      {
        options: ["Cơ hội Nhà ở cho Người bị AIDS"],
        text: "Cơ hội về nhà ở cho người bị AIDS",
        opt_out_text: "Tôi không muốn bị xem xét",
      },
      {
        options: ["Căn hộ phần 8 của Cơ quan Quản lý Nhà ở Berkeley dựa trên phiếu mua hàng"],
        text: "Berkeley Housing Authority Apartments",
        opt_out_text: "Tôi không muốn bị xem xét",
      },
      {
        options: [
          "Có, tôi đã đăng ký với một tổ chức hỗ trợ người khuyết tật phát triển",
          "Không, tôi chưa đăng ký với tổ chức hỗ trợ người khuyết tật phát triển",
        ],
        text: "Đăng ký Khuyết tật Phát triển",
        opt_out_text:
          "Tôi không biết liệu mình có đăng ký với tổ chức hỗ trợ người khuyết tật phát triển hay không",
      },
      {
        options: [
          "Cư trú",
          "Gia đình",
          "Cựu chiến binh",
          "Vô gia cư",
          "Không có tùy chọn nào trong số này áp dụng cho tôi, nhưng tôi muốn được xem xét",
        ],
        text: "VOUCHER DỰ ÁN ỦY QUYỀN NHÀ Ở OAKLAND",
        opt_out_text:
          "Tôi không muốn được xem xét cho các đơn vị chứng từ dựa trên dự án của Cơ quan Nhà ở Oakland",
      },
      {
        options: [
          "Sống ở Sở thích của Thành phố Alameda",
          "Làm việc tại Thành phố Alameda Preference",
        ],
        text: "Sống / Làm việc ở Thành phố Alameda",
        opt_out_text: null,
      },
      {
        options: [
          "Sống trong Sở thích Khu vực Tri-Valley",
          "Sở thích Làm việc ở Khu vực Tri-Valley (Dublin, Livermore, Pleasanton)",
        ],
        text: "Sống / Làm việc ở Khu vực Tri-Valley",
        opt_out_text: null,
      },
      {
        options: [
          "Có, tôi hoặc ai đó trong gia đình tôi bị khuyết tật về phát triển",
          "Không, không ai trong gia đình tôi bị khuyết tật phát triển",
        ],
        text: "Khuyết tật phát triển",
        opt_out_text:
          "Tôi không biết trong gia đình mình có người bị khuyết tật phát triển hay không",
      },
      {
        options: [
          "Ít nhất một thành viên trong gia đình tôi là cư dân trước đây của Làng Rosefield",
        ],
        text: "Những Cư dân Trước đây của Làng Rosefield đã Di dời ra Bên ngoài Thành phố Alameda",
        opt_out_text: null,
      },
      {
        options: [
          "Ít nhất một thành viên trong gia đình tôi là nhân viên của Học khu Thống nhất Alameda",
        ],
        text: "Nhân viên của Học khu Thống nhất Alameda (AUSD)",
        opt_out_text: null,
      },
      {
        options: [
          "Sống ở Thành phố Ưu tiên của Livermore",
          "Làm việc tại Thành phố Ưu tiên của Livermore",
        ],
        text: "Sống / Làm việc ở Livermore",
        opt_out_text: null,
      },
      {
        options: [
          "Bị chấm dứt do không đủ tiền",
          "Phiếu thưởng bị rút lại do không đủ tiền",
          "Ưu tiên Chuyển tiền Khẩn cấp của Người tham gia Hiện tại",
          "Vô gia cư",
          "Tùy chọn gia đình bị loại bỏ",
          "Sở thích Cư trú",
          "Sở thích Làm việc",
          "Sở thích của cựu chiến binh",
          "Không có ưu đãi nào trong số này được áp dụng, nhưng tôi vẫn muốn được xem xét cho các đơn vị PBV",
          "Đừng coi tôi là đơn vị PBV",
          "Tôi chỉ muốn được xem xét cho các đơn vị PBV",
        ],
        text: "Cơ quan Quản lý Nhà ở Livermore Ưu đãi cho các Đơn vị Chứng từ Dựa trên Dự án",
        opt_out_text: null,
      },
      {
        options: ["Sở thích hộ gia đình bị loại bỏ"],
        text: "Hộ gia đình ở Oakland",
        opt_out_text: null,
      },
      {
        options: [
          "Ít nhất một thành viên trong gia đình của tôi phải chấm dứt các hạn chế về khả năng chi trả",
        ],
        text: "Những người bị chấm dứt các hạn chế về khả năng chi trả",
        opt_out_text: null,
      },
      {
        options: [
          "Ít nhất một thành viên trong gia đình tôi sống ở Thành phố Foster",
          "Ít nhất một thành viên trong gia đình tôi làm việc ở Thành phố Foster",
        ],
        text: "Sống và làm việc ở Foster City",
        opt_out_text: null,
      },
      {
        options: ["Ít nhất một thành viên trong gia đình tôi sống ở Thành phố Foster"],
        text: "Sống ở thành phố Foster",
        opt_out_text: null,
      },
      {
        options: [
          "Ít nhất một thành viên trong gia đình tôi là nhân viên của Thành phố Foster City",
        ],
        text: "City of Foster City Nhân viên",
        opt_out_text: null,
      },
      {
        options: ["Ít nhất một thành viên trong gia đình tôi là nhân viên của khu học chánh"],
        text: "Nhân viên Học khu",
        opt_out_text: null,
      },
      {
        options: ["Ít nhất một thành viên trong gia đình tôi làm việc ở Thành phố Foster"],
        text: "Làm việc ở thành phố Foster",
        opt_out_text: null,
      },
      {
        options: [
          "Ít nhất một thành viên trong gia đình tôi sống ở Thành phố San Mateo",
          "Ít nhất một thành viên trong gia đình tôi làm việc ở Thành phố San Mateo",
        ],
        text: "Sống hoặc làm việc ở Thành phố San Mateo",
        opt_out_text: null,
      },
      {
        options: [
          "Ít nhất một thành viên trong gia đình tôi sống ở Thành phố Đông Palo Alto",
          "Ít nhất một thành viên trong gia đình tôi làm việc 20 giờ mỗi tuần hoặc hơn ở Thành phố Đông Palo Alto",
        ],
        text: "Sống hoặc làm việc ở Thành phố Đông Palo Alto",
        opt_out_text: null,
      },
      {
        options: [
          "Thiên tai do Thống đốc tuyên bố",
          "Bạo lực gia đình",
          "Hoạt động Thực thi Quy tắc Thành phố",
          'Một vụ trục xuất "Không có lỗi" khỏi một đơn vị cho thuê ở Đông Palo Alto trong năm ngoái của đơn đăng ký này',
          "Giá thuê tăng 10% trở lên trong 12 tháng qua",
        ],
        text: "Di dời không tự nguyện từ Đông Palo Alto",
        opt_out_text: null,
      },
      {
        options: ["Sống hoặc Làm việc", "Gia đình", "Cựu chiến binh"],
        text: "Oakland Housing Authority Preferences",
        opt_out_text: null,
      },
      {
        options: [
          "Sống ở Fremont: Ít nhất một thành viên trong gia đình tôi sống * ở Thành phố Fremont",
          "Làm việc ở Fremont: Ít nhất một thành viên trong gia đình tôi làm việc ** ở Thành phố Fremont",
        ],
        text: "City of Fremont Preferences",
        opt_out_text: null,
      },
      {
        options: [
          "Ít nhất một thành viên trong gia đình tôi sống ở Emeryville",
          "Ít nhất một thành viên trong gia đình tôi làm việc ít nhất 50% số giờ hàng tuần ở Emeryville",
          "Tôi có con ghi danh vào Học khu Thống nhất Emeryville (EUSD) hoặc Trung tâm Phát triển Trẻ em Emeryville (ECDC)",
        ],
        text: "Sở thích về Nhà ở của Thành phố Emeryville",
        opt_out_text: null,
      },
      {
        options: [
          "Sống ở Fremont, Newark hoặc Union City",
          "Làm việc ở Fremont, Newark hoặc Union City",
        ],
        text: "Sở thích về Nhà ở của Vùng Quận Nam Alameda",
        opt_out_text: null,
      },
      {
        options: ["Có", "Không"],
        text: "Cựu chiến binh",
        opt_out_text: "Không muốn nói",
      },
      {
        options: ["Có", "Không"],
        text: "Thời đại chuyển tiếp Thanh niên",
        opt_out_text: "Không muốn nói",
      },
      {
        options: ["Có", "Không"],
        text: "Khuyết tật phát triển",
        opt_out_text: "Không muốn nói",
      },
      {
        options: [
          "Tôi có một nơi nào đó để ở, nhưng nó không phải là vĩnh viễn",
          "Tôi vô gia cư",
          "Không",
        ],
        text: "Tình hình nhà ở",
        opt_out_text: "Không muốn nói",
      },
      {
        options: [
          "Căn hộ vừa túi tiền với giá thuê căn hộ",
          "Căn hộ giá cả phải chăng dựa trên dự án với giá thuê bằng 30% thu nhập của bạn",
        ],
        text: "Thuê cố định & Thuê dựa trên Thu nhập",
        opt_out_text: null,
      },
      {
        options: ["Cựu chiến binh", "Tình trạng cựu chiến binh"],
        text:
          "State of California - Chương trình Phòng chống Gia cư và Vô gia cư cho Cựu chiến binh (VHHP)",
        opt_out_text: null,
      },
      {
        options: ["Tôi quan tâm"],
        text: "Cơ hội nhà ở cho người bị AIDS (HOPWA)",
        opt_out_text: "Tôi không quan tâm",
      },
      {
        options: [
          "Vâng, tôi là Người cho thuê đã Đăng ký của Thành phố San Mateo",
          "Không, tôi không phải là Người cho thuê đã Đăng ký của Thành phố San Mateo",
        ],
        text: "Người cho thuê đã đăng ký của Thành phố San Mateo",
        opt_out_text: "Tôi không muốn tùy chọn này",
      },
      {
        options: [
          "Ít nhất một thành viên trong gia đình tôi là nhân viên của Thành phố Foster City",
        ],
        text: "City of Foster City Nhân viên",
        opt_out_text: null,
      },
      {
        options: ["Sống ở Sở thích của Hạt Alameda", "Làm việc ở Sở thích của Hạt Alameda"],
        text: "Sống / Làm việc ở Quận Alameda",
        opt_out_text: null,
      },
      {
        options: ["Sống ở Sở thích của Hạt Alameda", "Làm việc ở Sở thích của Hạt Alameda"],
        text: "Sống / Làm việc ở Quận Alameda",
        opt_out_text: null,
      },
    ],
    zh: [
      {
        options: ["居住在 %{county} County Preference", "Work in %{county} County Preference"],
        text: "在海沃德市生活或工作",
        opt_out_text: null,
      },
      {
        options: [
          "我的家庭中至少有一名成员住在都柏林(3 分)",
          "我的至少一名家庭成员在都柏林有直系亲属(1 分)",
          "由于住宅被拆除或住宅从出租单位转为待售单位的谈话,我的至少一名家庭成员需要从目前的都柏林住宅搬迁(1 分)",
          "我的至少一名家庭成员在都柏林全职工作(3 分)",
          "我的家庭中至少有一名成员是都柏林的公共服务人员(加分)",
          "我的家庭中至少有一名成员永久残疾(1 分)",
          "我的家庭中至少有一名成员是老年人,定义为 62 岁及以上(1 分)",
          "我家有人曾在美国军队服役(1 分)",
        ],
        text: "都柏林市住房偏好",
        opt_out_text: null,
      },
      {
        options: ["邻里居民偏好"],
        text: "邻里居民",
        opt_out_text: null,
      },
      {
        options: ["住在奥克兰市的偏好", "在奥克兰市优先工作"],
        text: "在奥克兰生活/工作",
        opt_out_text: null,
      },
      {
        options: ["流离失所者租户住房偏好", "任务走廊"],
        text: "流离失所者租户或 Mission Boulevard Corridor (SR 238) 流离失所者租户住房偏好",
        opt_out_text: null,
      },
      {
        options: ["艾滋病人的住房机会"],
        text: "艾滋病人的住房机会",
        opt_out_text: "我不想被考虑",
      },
      {
        options: ["伯克利住房管理局项目基于凭证第 8 节公寓"],
        text: "伯克利房屋委员会公寓",
        opt_out_text: "我不想被考虑",
      },
      {
        options: ["是的,我在一个支持发育障碍的组织注册", "不,我没有在支持发育障碍的组织注册"],
        text: "发育障碍登记",
        opt_out_text: "我不知道我是否在支持发育障碍的组织中注册",
      },
      {
        options: ["居住权", "家庭", "老将", "无家可归", "这些偏好均不适用于我，但我希望被考虑"],
        text: "奥克兰住房管理局基于项目的凭证",
        opt_out_text: "我不想被考虑申请奥克兰房屋委员会基于项目的代金券单位",
      },
      {
        options: ["住在阿拉米达市的偏好", "在阿拉米达市工作偏好"],
        text: "在阿拉米达市生活/工作",
        opt_out_text: null,
      },
      {
        options: ["住在三谷地区偏好", "在 Tri-Valley 地区(都柏林、利弗莫尔、普莱森顿)工作的偏好"],
        text: "在三谷地区生活/工作",
        opt_out_text: null,
      },
      {
        options: ["是的,我或我家中的某个人有发育障碍", "不,我家没有人有发育障碍"],
        text: "发育障碍",
        opt_out_text: "我不知道我家是否有人有发育障碍",
      },
      {
        options: ["我家中至少有一名成员曾是罗斯菲尔德村的居民"],
        text: "罗斯菲尔德村以前的居民搬迁到阿拉米达市外",
        opt_out_text: null,
      },
      {
        options: ["我家中至少有一个成员是阿拉米达联合学区的员工"],
        text: "阿拉米达联合学区 (AUSD) 员工",
        opt_out_text: null,
      },
      {
        options: ["住在利弗莫尔首选城市", "在利弗莫尔市工作"],
        text: "在利弗莫尔生活/工作",
        opt_out_text: null,
      },
      {
        options: [
          "因资金不足而终止",
          "由于资金不足而撤回的代金券",
          "现有参与者紧急转移偏好",
          "无家可归",
          "流离失所的家庭偏好",
          "居住偏好",
          "工作偏好",
          "退伍军人的偏好",
          "这些偏好均不适用,但我仍希望被 PBV 单位考虑",
          "不要为 PBV 单位考虑我",
          "我只想为PBV单位考虑",
        ],
        text: "利弗莫尔住房管理局对基于项目的凭证单元的偏好",
        opt_out_text: null,
      },
      {
        options: ["流离失所的家庭偏好"],
        text: "奥克兰流离失所的家庭",
        opt_out_text: null,
      },
      {
        options: ["我的至少一名家庭成员受到终止负担能力限制"],
        text: "受终止负担能力限制的人",
        opt_out_text: null,
      },
      {
        options: ["我家至少有一个人住在福斯特城", "我的至少一名家庭成员在福斯特城工作"],
        text: "在福斯特城生活和工作",
        opt_out_text: null,
      },
      {
        options: ["我的家庭中至少有一名成员住在福斯特城"],
        text: "住在福斯特城",
        opt_out_text: null,
      },
      {
        options: ["我的家庭中至少有一名成员是福斯特市的雇员"],
        text: "福斯特市员工",
        opt_out_text: null,
      },
      {
        options: ["我的家庭中至少有一个成员是学区雇员"],
        text: "学区员工",
        opt_out_text: null,
      },
      {
        options: ["我的至少一名家庭成员在福斯特城工作"],
        text: "在福斯特城工作",
        opt_out_text: null,
      },
      {
        options: ["我的至少一名家庭成员住在圣马特奥市", "我的至少一名家庭成员在圣马特奥市工作"],

        text: "在圣马特奥市生活或工作",
        opt_out_text: null,
      },
      {
        options: [
          "我家至少有一名成员住在东帕洛阿尔托市",
          "我的至少一名家庭成员每周在东帕洛阿尔托市工作 20 小时或更长时间",
        ],
        text: "在东帕洛阿尔托市生活或工作",
        opt_out_text: null,
      },
      {
        options: [
          "总督宣布的自然灾害",
          "家庭暴力",
          "城市代码执法活动",
          '在此申请的最后一年内,东帕洛阿尔托的一个出租单元"无过错"驱逐',
          "过去 12 个月租金上涨 10% 或更高",
        ],
        text: "从东帕洛阿尔托非自愿流离失所",
        opt_out_text: null,
      },
      {
        options: ["生活或工作", "家庭", "老将"],
        text: "奥克兰住房管理局偏好",
        opt_out_text: null,
      },
      {
        options: [
          "住在弗里蒙特:我的家庭中至少有一名成员*住在弗里蒙特市",
          "在弗里蒙特工作:我的至少一名家庭成员在弗里蒙特市工作**",
        ],
        text: "弗里蒙特市偏好",
        opt_out_text: null,
      },
      {
        options: [
          "我家至少有一名成员住在埃默里维尔",
          "我的至少一名家庭成员每周至少有 50% 的时间在埃默里维尔工作",
          "我有一个孩子就读于埃默里维尔联合学区 (EUSD) 或埃默里维尔儿童发展中心 (ECDC)",
        ],
        text: "埃默里维尔市住房偏好",
        opt_out_text: null,
      },
      {
        options: ["住在弗里蒙特、纽瓦克或联合市", "在弗里蒙特、纽瓦克或联合市工作"],
        text: "南阿拉米达县地区住房偏好",
        opt_out_text: null,
      },
      {
        options: ["是", "否"],
        text: "老手",
        opt_out_text: "不想说",
      },
      {
        options: ["是", "否"],
        text: "过渡时代青年",
        opt_out_text: "不想说",
      },
      {
        options: ["是", "否"],
        text: "发育障碍",
        opt_out_text: "不想说",
      },
      {
        options: ["我有地方住,但不是永久的", "我无家可归", "否"],
        text: "住房情况",
        opt_out_text: "不想说",
      },
      {
        options: ["平租平价公寓", "基于项目的经济适用公寓,租金为您收入的 30%"],
        text: "平租和基于收入的租金",
        opt_out_text: null,
      },
      {
        options: ["老将", "退伍军人身份"],
        text: "加利福尼亚州 - 退伍军人住房和无家可归预防计划 (VHHP)",
        opt_out_text: null,
      },
      {
        options: ["我很感兴趣"],
        text: "艾滋病人的住房机会 (HOPWA)",
        opt_out_text: "我对此不感兴趣",
      },
      {
        options: ["是的，我是圣马特奥市注册租户", "不，我不是圣马特奥市注册租户"],
        text: "圣马特奥市注册租户",
        opt_out_text: "我不想要这个偏好",
      },
      {
        options: ["我的家庭中至少有一名成员是福斯特市的雇员"],
        text: "福斯特市员工",
        opt_out_text: null,
      },
      {
        options: ["住在阿拉米达县偏好", "在阿拉米达县工作优先", "在阿拉米达县工作偏好"],
        text: "在阿拉米达县生活/工作",
        opt_out_text: null,
      },
      {
        options: ["住在阿拉米达县偏好", "在阿拉米达县工作优先"],
        text: "在阿拉米达县生活/工作",
        opt_out_text: null,
      },
      {
        options: ["我很感兴趣"],
        text: "艾滋病患者的住房机会 (HOPWA)",
        opt_out_text: "我对此不感兴趣",
      },
      {
        options: ["生活或工作", "家庭", "老将"],
        text: "奥克兰房屋委员会偏好",
        opt_out_text: null,
      },
    ],
    tl: [
      {
        options: [
          "Naninirahan sa %{county} County Preference",
          "Work in %{county} County Preference",
        ],
        text: "Live or Work in City of Hayward",
        opt_out_text: null,
      },
      {
        options: [
          "Hindi bababa sa isang miyembro ng aking sambahayan ang nakatira sa Dublin (3 puntos)",
          "Hindi bababa sa isang miyembro ng aking sambahayan ang may malapit na miyembro ng pamilya sa Dublin (1 punto)",
          "Kailangan ng kahit isang miyembro ng aking sambahayan na lumipat mula sa kasalukuyang tirahan sa Dublin dahil sa demolisyon ng tirahan o pag-uusap ng tirahan mula sa paupahan patungo sa for-sale unit (1 point)",
          "Hindi bababa sa isang miyembro ng aking sambahayan ang nagtatrabaho ng full-time sa Dublin (3 puntos)",
          "Hindi bababa sa isang miyembro ng aking sambahayan ay isang empleyado ng pampublikong serbisyo sa Dublin (1 karagdagang punto)",
          "Hindi bababa sa isang miyembro ng aking sambahayan ang permanenteng may kapansanan (1 puntos)",
          "Hindi bababa sa isang miyembro ng aking sambahayan ang nakatatanda, na tinukoy bilang edad 62 at mas matanda (1 puntos)",
          "May isang tao sa aking sambahayan ay nagsilbi sa militar ng U.S. (1 puntos)",
        ],
        text: "Mga Kagustuhan sa Pabahay ng Lungsod ng Dublin",
        opt_out_text: null,
      },
      {
        options: ["Kagustuhan ng mga Naninirahan sa Kapitbahayan"],
        text: "Mga Naninirahan sa Kapitbahayan",
        opt_out_text: null,
      },
      {
        options: [
          "Nakatira sa Lungsod ng Oakland Preference",
          "Magtrabaho sa City of Oakland Preference",
        ],
        text: "Nakatira/Nagtatrabaho sa Oakland",
        opt_out_text: null,
      },
      {
        options: ["Displacee Tenant Housing Preference", "Mission Corridor"],
        text:
          "Displacee Tenant o Mission Boulevard Corridor (SR 238) Displacee Tenant Housing Preference",
        opt_out_text: null,
      },
      {
        options: ["Mga Oportunidad sa Pabahay para sa mga Taong may AIDS"],
        text: "Mga Oportunidad sa Pabahay para sa mga Taong may AIDS",
        opt_out_text: "Ayaw kong isaalang-alang",
      },
      {
        options: ["Berkeley Housing Authority Project Based Voucher Section 8 apartments"],
        text: "Berkeley Housing Authority Apartments",
        opt_out_text: "Ayaw kong isaalang-alang",
      },
      {
        options: [
          "Oo, nakarehistro ako sa isang organisasyong sumusuporta sa mga kapansanan sa pag-unlad",
          "Hindi, hindi ako nakarehistro sa isang organisasyong sumusuporta sa mga kapansanan sa pag-unlad",
        ],
        text: "Rehistrasyon ng Developmental Disability",
        opt_out_text:
          "Hindi ko alam kung nakarehistro ako sa isang organisasyong sumusuporta sa mga kapansanan sa pag-unlad",
      },
      {
        options: [
          "Paninirahan",
          "Pamilya",
          "Beterano",
          "Walang tirahan",
          "Wala sa mga kagustuhang ito ang naaangkop sa akin, ngunit nais kong isaalang-alang",
        ],
        text: "OAKLAND HOUSING AUTHORITY PROJECT-BASED VOUCHER",
        opt_out_text:
          "Hindi ko gustong isaalang-alang para sa mga unit ng voucher na nakabatay sa proyekto ng Oakland Housing Authority",
      },
      {
        options: [
          "Tumira sa Lungsod ng Alameda Preference",
          "Trabaho sa Lungsod ng Alameda Preference",
        ],
        text: "Live/Trabaho sa Lungsod ng Alameda",
        opt_out_text: null,
      },
      {
        options: [
          "Tumira sa Tri-Valley Area Preference",
          "Magtrabaho sa Tri-Valley Area (Dublin, Livermore, Pleasanton) Preference",
        ],
        text: "Live/Trabaho sa Tri-Valley Area",
        opt_out_text: null,
      },
      {
        options: [
          "Oo, ako o ang isang tao sa aking sambahayan ay may kapansanan sa pag-unlad",
          "Hindi, walang sinuman sa aking sambahayan ang may kapansanan sa pag-unlad",
        ],
        text: "Developmental Disability",
        opt_out_text:
          "Hindi ko alam kung ang isang tao sa aking sambahayan ay may kapansanan sa pag-unlad",
      },
      {
        options: [
          "Hindi bababa sa isang miyembro ng aking sambahayan ang dating residente ng Rosefield Village",
        ],
        text:
          "Ang mga Nakaraang Naninirahan sa Rosefield Village ay Inilipat sa Labas ng Lungsod ng Alameda",
        opt_out_text: null,
      },
      {
        options: [
          "Kahit isang miyembro ng aking sambahayan ay empleyado ng Alameda Unified School District",
        ],
        text: "Empleyado ng Alameda Unified School District (AUSD)",
        opt_out_text: null,
      },
      {
        options: [
          "Tumira sa Lungsod ng Livermore Preference",
          "Trabaho sa Lungsod ng Livermore Preference",
        ],
        text: "Live/Trabaho sa Livermore",
        opt_out_text: null,
      },
      {
        options: [
          "Tinanggal dahil sa Hindi sapat na pondo",
          "Na-withdraw ang Voucher dahil sa Hindi sapat na pondo",
          "Kasalukuyang Kagustuhan sa Paglipat ng Emergency ng Kalahok",
          "Walang tirahan",
          "Displaced Family Preference",
          "Kagustuhan sa Paninirahan",
          "Kagustuhan sa Pagtatrabaho",
          "Kagustuhan ng Beterano",
          "Wala sa mga kagustuhang ito ang nalalapat, ngunit gusto ko pa ring isaalang-alang para sa mga yunit ng PBV",
          "Huwag mo akong isaalang-alang para sa PBV units",
          "Gusto ko lang ma-consider para sa PBV units",
        ],
        text: "Livermore Housing Authority Preferences para sa Project-Based Voucher Units",
        opt_out_text: null,
      },
      {
        options: ["Inilipat na Kagustuhan sa Sambahayan"],
        text: "Oakland Displaced Household",
        opt_out_text: null,
      },
      {
        options: [
          "Hindi bababa sa isang miyembro ng aking sambahayan ang napapailalim sa pagwawakas ng mga paghihigpit sa abot-kaya",
        ],
        text: "Mga taong napapailalim sa pagwawakas ng mga paghihigpit sa abot-kaya",
        opt_out_text: null,
      },
      {
        options: [
          "Kahit isang miyembro ng aking sambahayan ang nakatira sa Foster City",
          "Kahit isang miyembro ng aking sambahayan ang nagtatrabaho sa Foster City",
        ],
        text: "Tumira at magtrabaho sa Foster City",
        opt_out_text: null,
      },
      {
        options: ["Kahit isang miyembro ng aking sambahayan ang nakatira sa Foster City"],
        text: "Tumira sa Foster City",
        opt_out_text: null,
      },
      {
        options: ["Kahit isang miyembro ng aking sambahayan ay empleyado ng City of Foster City"],
        text: "City of Foster City Employees",
        opt_out_text: null,
      },
      {
        options: ["Kahit isang miyembro ng aking sambahayan ay empleyado ng distrito ng paaralan"],
        text: "Mga Empleyado ng School District",
        opt_out_text: null,
      },
      {
        options: ["Kahit isang miyembro ng aking sambahayan ang nagtatrabaho sa Foster City"],
        text: "Trabaho sa Foster City",
        opt_out_text: null,
      },
      {
        options: [
          "Kahit isang miyembro ng aking sambahayan ang nakatira sa Lungsod ng San Mateo",
          "Kahit isang miyembro ng aking sambahayan ang nagtatrabaho sa Lungsod ng San Mateo",
        ],
        text: "Naninirahan o nagtatrabaho sa Lungsod ng San Mateo",
        opt_out_text: null,
      },
      {
        options: [
          "Hindi bababa sa isang miyembro ng aking sambahayan ang nakatira sa Lungsod ng East Palo Alto",
          "Hindi bababa sa isang miyembro ng aking sambahayan ang nagtatrabaho ng 20 oras bawat linggo o higit pa sa Lungsod ng East Palo Alto",
        ],
        text: "Naninirahan o nagtatrabaho sa Lungsod ng East Palo Alto",
        opt_out_text: null,
      },
      {
        options: [
          "Natural Disaster na idineklara ng Gobernador",
          "Domestikong karahasan",
          "Aktibidad sa Pagpapatupad ng Code ng Lungsod",
          'Isang "No Fault" Eviction mula sa isang rental unit sa East Palo Alto sa loob ng huling taon ng application na ito',
          "Isang 10% o mas mataas na pagtaas sa upa sa nakalipas na 12 buwan",
        ],
        text: "Involuntary Displacement from East Palo Alto",
        opt_out_text: null,
      },
      {
        options: ["Live or Work", "Family", "Beterano"],
        text: "Oakland Housing Authority Preferences",
        opt_out_text: null,
      },
      {
        options: [
          "Tumira sa Fremont: Hindi bababa sa isang miyembro ng aking sambahayan ang nakatira* sa Lungsod ng Fremont",
          "Trabaho sa Fremont: Hindi bababa sa isang miyembro ng aking sambahayan ang nagtatrabaho** sa Lungsod ng Fremont",
        ],
        text: "Lungsod ng Fremont Preferences",
        opt_out_text: null,
      },
      {
        options: [
          "Kahit isang miyembro ng aking sambahayan ang nakatira sa Emeryville",
          "Hindi bababa sa isang miyembro ng aking sambahayan ang nagtatrabaho ng hindi bababa sa 50% ng lingguhang oras sa Emeryville",
          "Mayroon akong anak na naka-enroll sa Emeryville Unified School District (EUSD) o Emeryville Child Development Center (ECDC)",
        ],
        text: "Mga Kagustuhan sa Pabahay ng Lungsod ng Emeryville",
        opt_out_text: null,
      },
      {
        options: [
          "Nakatira sa Fremont, Newark o Union City",
          "Magtrabaho sa Fremont, Newark o Union City",
        ],
        text: "Mga Kagustuhan sa Pabahay ng Rehiyon ng South Alameda County",
        opt_out_text: null,
      },
      {
        options: ["Oo", "Hindi"],
        text: "Beterano",
        opt_out_text: "Mas gustong hindi sabihin",
      },
      {
        options: ["Oo", "Hindi"],
        text: "Transition Age Youth",
        opt_out_text: "Mas gustong hindi sabihin",
      },
      {
        options: ["Oo", "Hindi"],
        text: "Developmental Disability",
        opt_out_text: "Mas gustong hindi sabihin",
      },
      {
        options: [
          "Mayroon akong matutuluyan, ngunit hindi ito permanente",
          "Wala akong tirahan",
          "Hindi",
        ],
        text: "Kalagayan ng Pabahay",
        opt_out_text: "Mas gustong hindi sabihin",
      },
      {
        options: [
          "Abot-kayang apartment na may flat na upa",
          "Mga apartment na nakabatay sa proyekto na may upa sa 30% ng iyong kita",
        ],
        text: "Flat Rent at Rent Batay sa Kita",
        opt_out_text: null,
      },
      {
        options: ["Beterano", "Katayuan ng Beterano"],
        text: "State of California - Veterans Housing and Homelessness Prevention Program (VHHP)",
        opt_out_text: null,
      },
      {
        options: ["Interesado ako"],
        text: "Mga Pagkakataon sa Pabahay para sa mga Taong may AIDS (HOPWA)",
        opt_out_text: "Hindi ako interesado",
      },
      {
        options: [
          "Oo, ako ay isang City of San Mateo Registered Renter ",
          "Hindi, hindi ako isang City of San Mateo Registered Renter ",
        ],
        text: "City of San Mateo Registered Renter",
        opt_out_text: "Hindi ko gusto ang kagustuhang ito",
      },
      {
        options: ["Kahit isang miyembro ng aking sambahayan ay empleyado ng City of Foster City"],
        text: "City of Foster City Employees",
        opt_out_text: null,
      },
      {
        options: [
          "Naninirahan sa Alameda County Preference",
          "Trabaho sa Alameda County Preference",
        ],
        text: "Live/Trabaho sa Alameda County",
        opt_out_text: null,
      },
      {
        options: [
          "Naninirahan sa Alameda County Preference",
          "Trabaho sa Alameda County Preference",
        ],
        text: "Live/Trabaho sa Alameda County",
        opt_out_text: null,
      },
    ],
  }

  public needToUntranslate(app): boolean {
    if (app.programs?.length) {
      for (const program of app.programs) {
        const match = this.matchesEnglishVersion(program.key)
        if (!match) {
          return !match
        }
      }
    }
    if (app.preferences?.length) {
      for (const preference of app.preferences) {
        const match = this.matchesEnglishVersion(preference.key)
        if (!match) {
          return !match
        }
      }
    }
    return false
  }

  public matchesEnglishVersion(key: string) {
    const translationSet = this.translations["en"]
    return translationSet.some((translation) => translation.text === key)
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // get application id, language, program, preference where application language was not english
    const applications = await queryRunner.query(`
        SELECT
            a.id,
            a.language,
            a.programs,
            a.preferences
        FROM applications a
          LEFT JOIN listings l ON l.id = a.listing_id
        WHERE (a.programs != '[]' OR a.preferences != '[]')
            AND a.created_at > '06/01/2022'
            AND l.name not like '%test%' AND l.name not like '%Test%'
        ORDER BY a.created_at desc
    `)

    const promiseArray: Promise<any>[] = []
    for (const app of applications) {
      // check to see if the data needs to be untranslated
      if (this.needToUntranslate(app)) {
        // update the program/preference data
        promiseArray.push(this.untranslate(app, queryRunner))
      }
    }
    await Promise.all(promiseArray)
  }

  public findTranslation(key: string, keyIndex: number) {
    for (const translationSetKey in this.translations) {
      // loop through all possible translation values
      const translationSet = this.translations[translationSetKey]

      if (keyIndex === -1) {
        // if we searching for a top level key
        const topLevelIndex = translationSet.findIndex((translation) => translation.text === key)
        if (topLevelIndex !== -1) {
          return { topLevelIndex }
        }
      } else {
        // if we are searching for an option key
        const translation = translationSet[keyIndex]
        if (translation?.options?.length) {
          let useOptOut = false
          const optionIndex = translation.options.findIndex((option) => option === key)
          if (optionIndex === -1 && translation.opt_out_text === key) {
            // if we haven't found the option in this set, check the opt out text
            useOptOut = true
          }
          if (optionIndex !== -1 || useOptOut) {
            return { topLevelIndex: keyIndex, optionIndex, useOptOut }
          }
        }
      }
    }
    return { topLevelIndex: -1, optionIndex: -1, useOptOut: false }
  }

  public untranslateHelper(dataSet: any[], app: any) {
    if (!dataSet?.length) {
      return []
    }
    const englishTranslations = this.translations["en"]
    return dataSet.map((data) => {
      const toReturn: any = { ...data }
      const { topLevelIndex: keyIndex } = this.findTranslation(data.key, -1)

      if (keyIndex === -1) {
        console.error(app)
        throw new Error("no key translation found")
      }
      toReturn.key = englishTranslations[keyIndex].text

      if (data.options?.length) {
        data.options.forEach((option, index) => {
          const { topLevelIndex, optionIndex, useOptOut } = this.findTranslation(
            option.key,
            keyIndex
          )

          if (optionIndex === -1 && !useOptOut) {
            console.error(app)
            throw new Error("no option translation found")
          }

          toReturn.options[index].key = useOptOut
            ? englishTranslations[topLevelIndex].opt_out_text
            : englishTranslations[topLevelIndex].options[optionIndex]

          return toReturn
        })
      }
      return toReturn
    })
  }

  public untranslate(app: any, queryRunner: QueryRunner) {
    const updatePrograms = this.untranslateHelper(app.programs, app)
    const updatePreferences = this.untranslateHelper(app.preferences, app)

    return queryRunner.query(
      `
        UPDATE applications
        SET programs = $1, preferences = $2
        WHERE id = $3
      `,
      [JSON.stringify(updatePrograms), JSON.stringify(updatePreferences), app.id]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
