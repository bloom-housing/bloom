import { MigrationInterface, QueryRunner } from "typeorm"

const sjTermsContent = `
### Privacy and Disclosure

The purpose of this statement is to define the City of San Jose’s policy with regards to the collection and use of personally identifiable information (PII). PII is any information relating to an identified or identifiable individual who is the subject of the information.

The City of San Jose collects two kinds of customer information: (1) anonymous; (2) personally identifiable information (PII).

**a. Anonymous information**: This type of information does not identify specific individuals and is automatically transmitted by your browser. This information consists of:

<div class="pl-3">
  <ul>
    <li>The URL (Uniform Resource Locator or address) of the web page you previously visited;</li>
    <li>The domain names and/or IP addresses which are numbers that are automatically assigned to your computer whenever you are connected to the Internet or World Wide Web, and</li>
    <li>The browser version you are using to access the site.</li>
  </ul>
</div>

This information is used to help improve the Doorway Affordable Housing Portal. None of the information can be linked to an individual.

**b. Personally Identifiable Information (PII)**: This type of information could include name, address, email, address, telephone number, credit/debit card information. The City will make every reasonable effort to protect your privacy. It restricts access to your personal identifiable information to those employees who will respond to your request. The City does not intentionally disclose any personal information about our customers to any third parties or outside the City except as required by law or by the consent of the person providing the information. The City only collects personally identifiable information that is required to provide service. You can decline to provide us with any personal information. However, if you should choose to withhold requested information, the City may not be able to provide you with the online services dependent upon the collection of that information.

<div class="pl-3">
  <ul>
    <li>Access to Personally Identifiable Information: Access to personally identifiable information in public records at local levels of government in San Jose is controlled primarily by the California Public Records Act (Government Code Section 6250, et. seq.). Information that is generally available under the Public Records Act may be posted for electronic access through the Doorway Affordable Housing Portal. While the Public Records Act sets the general policies for access to City records, other sections of the California code as well as federal laws also deal with confidentiality issues.</li>
    <li>Email addresses: Email addresses obtained through the Doorway Affordable Housing Portal will not be sold or given to other private companies for marketing purposes. The information collected is subject to the access and confidentiality provisions of the Public Records Act, other applicable sections of the California code as well as Federal laws. Email or other information requests sent to the Doorway Affordable Housing Portal may be maintained in order to respond to the request, forward that request to the appropriate agency within the City, communicate updates to the Doorway Affordable Housing Portal that may be of interest to citizens, or to provide the City web designer with valuable customer feedback to assist in improving the portal. Individuals can cancel any communications regarding new service updates at any time.</li>
    <li>Use of “Cookies”: Some City applications use “cookies”. A cookie is a small data file that certain web sites write to your hard drive when you visit them. A cookie file can contain information such as a user id that the portal uses to track the pages you have visited. But the only personal information a cookie can contain is information you supply yourself. A cookie is only a text file and cannot read data off your hard disk or read cookie files created by other sites. Cookies can track user traffic patterns, recognize your computer’s browser when you return, and could provide personalized content without requiring sign-in. You can refuse cookies by turning them off in your browser. However, they may be required to use some of the web applications on the Doorway Affordable Housing Portal.</li>
    <li>Security: The City of San Jose is committed to data security and the data quality of personally identifiable information that is either available from or collected by the Doorway Affordable Housing Portal and has taken reasonable precautions to protect such information from loss, misuse, or alteration.</li>
  </ul>
</div>

### Contractual Services for the Doorway Affordable Housing Portal and On-Line Services

To ensure that contractors who have access to or provide contractual services for the City’s On-Line (e-government) Services are not allowed to re-sell or in any way share or convey to another party or use it for another purpose any information that they may have access to in the course of doing business for the City; all city contracts regarding such services should contain a requirement that the contractor must comply with the Doorway Affordable Housing Portal and eGovernment policies.

### Electronic Signatures and Payments

The City of San Jose is committed to data security and the data quality of personally identifiable information that is either available from or collected by our web site and has taken reasonable precautions to protect such information from loss, misuse, or alteration. When a City application accepts credit cards or any other particularly sensitive information for any of its services, it encrypts all ordering information, such as your name and credit card number, in order to protect its confidentiality.

### Disclaimer

The City of San Jose is neither responsible nor liable for any delays, inaccuracies, errors or omissions arising out of your use of the portal or with respect to the material contained on the portal, including without limitation, any material posted on the portal nor for any viruses or other contamination of your system. The Doorway Affordable Housing Portal and all materials contained on it are distributed and transmitted “as is” without warranties of any kind, either express or implied, including without limitations, warranties of title or implied warranties of merchantability or fitness for a particular purpose. The City of San Jose is not responsible for any special, indirect, incidental or consequential damages that may arise from the use of, or the inability to use, the portal and/or the materials contained on the Site whether the materials contained on the portal are provided by the City of San Jose or a third party. The City of San Jose is neither responsible nor liable for any viruses or other contamination of your system.

### Access to Information

Unless otherwise prohibited by state or federal law, rule or regulation, you will be granted the ability to access and correct any personally identifiable information. The City will take reasonable steps to verify your identity before granting such access. Each City service that collects personally identifiable information will allow or review and update of that information.

### Non-City Web Sites

Non-city web sites may be linked through the Doorway Affordable Housing Portal. Many non-city sites may or may not be subject to the Public Records Act and may or may not be subject to other sections of the California Code or federal law. Visitors to such sites are advised to check the privacy statements of such sites and to be cautious about providing personally identifiable information without a clear understanding of how the information will be used. The City is not responsible for, and accepts no liability for, the availability of these outside resources. Linked Web sites are not under the control of, nor maintained by, the City and the City is not responsible for the content of these Web sites, which can and do change frequently; nor for any internal links the displayed Web sites may contain. In addition, inclusion of the linked Web sites does not constitute an endorsement or promotion by the City of any persons or organizations sponsoring the displayed Web sites.
`

export class addJurisdictionPartnerTerms1647858061141 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const loremIpsum =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    await queryRunner.query("UPDATE jurisdictions SET partner_terms = $1", [loremIpsum])
    await queryRunner.query("UPDATE jurisdictions SET partner_terms = $1 WHERE name = $2", [
      sjTermsContent,
      "San Jose",
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
