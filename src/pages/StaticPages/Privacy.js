
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Text } from '../../components/Text/Text';
import './staticPage.scss';
import { RiyalSymbol } from '../../components/RiyalSymbol/RiyalSymbol';

export const Privacy = () => {
  const { t, i18n } = useTranslation('application');

  const content_en = (
    <>
      <Helmet>
        <title>{t('seo.privacyPolicy.title')}</title>
        <meta name="description" content={t('seo.privacyPolicy.description')} />
      </Helmet>

      <Text type="headline2">Policies & Privacy</Text>

      <Text type="headline3">Quality Policy</Text>
      <Text type="body1">
        At Camel Step, we are passionate about delivering high-quality products and services that not only meet but exceed customer expectations in the coffee industry. We proudly adhere to the highest quality standards, including ISO 9001 for Quality Management and ISO 22000 for Food Safety, ensuring everything we do aligns with the highest benchmarks.
      </Text>
      <Text type="body1">Here’s what you can expect from us:</Text>
      <ul>
        <li><Text type="body1"><strong>⦁	Customer Satisfaction at Our Core:</strong>We are committed to understanding your unique needs and providing tailored solutions that ensure your continued satisfaction. Your satisfaction fuels our passion.</Text></li>
        <li><Text type="body1"><strong>Food Safety is Our Priority:</strong> We implement best practices in food safety, safeguarding every step of the production process to ensure the safety of our products.</Text></li>
        <li><Text type="body1"><strong>Continuous Improvement and Innovation:</strong> We strive not just to meet standards, but to set them. Through ongoing evaluation and enhancement of our processes, we remain committed to innovation and excellence.</Text></li>
        <li><Text type="body1"><strong>Reliable After-Sales Support:</strong> Our relationship with you doesn’t end at the point of sale. We provide training, consultation, and maintenance services to ensure your needs are met and our products perform optimally.</Text></li>
      </ul>
      <Text type="body1">
        By integrating the best practices in quality and food safety management systems, we achieve excellence across all levels. Trust us as your partner in delivering safe, high-quality products and sustainable success.
      </Text>

      <Text type="headline3">Privacy Policy</Text>
      <Text type="body1">
        Your privacy matters to us. At Came Step, we are committed to protecting your personal data in accordance with the data protection regulations enforced in the Kingdom of Saudi Arabia.
      </Text>
      <Text type="body1">
        All payment information is processed using advanced encryption and is not stored on our servers. We only use your data to enhance your experience and do not share it with any third party without your consent, unless required by law.
      </Text>
      <Text type="body1"><strong>Information Security:</strong> All payments are processed via trusted gateways using the latest encryption technologies to ensure customer data protection.</Text>

      <Text type="headline3">Personal Data Protection Policy</Text>
      <Text type="body1">Your data is our responsibility. At Camel Step, we are committed to safeguarding your data with utmost responsibility and transparency, including the following rights:</Text>
      <ul>
        <li><Text type="body1"><strong>Right to Know:</strong> Understand how your data is collected and why.</Text></li>
        <li><Text type="body1"><strong>Right to Access:</strong> Receive a copy of your personal data.</Text></li>
        <li><Text type="body1"><strong>Right to Rectification:</strong> Update inaccurate information.</Text></li>
        <li><Text type="body1"><strong>Right to Erasure:</strong> Request deletion when data retention is no longer necessary.</Text></li>
        <li><Text type="body1"><strong>Right to Withdraw Consent:</strong> ReRevoke your consent to data usage at any time.</Text></li>
      </ul>

      <Text type="headline3">Order Policy</Text>
      <Text type="body1">
        We offer full flexibility with orders to ensure your convenience. Customers may cancel orders and receive a full refund prior to shipping. Refunds will be processed within 20 business days. After shipping, our return and exchange policy in accordance with the Ministry of Commerce will apply.
      </Text>

      <Text type="headline3">Return & Exchange Policy</Text>
      <Text type="body1">
        To benefit from return and exchange services, an invoice is required. Products purchased during promotional offers are not eligible for return or exchange. If a product or device is defective, the value for return/exchange will be based on the promotional price.
      </Text>
      <Text type="body1">
        At Camel Step, your satisfaction is our priority. You may return or exchange products within 7 days of purchase, provided they were purchased from our branches or online store, remain in original condition, and have not been used. In the case of manufacturing defects, we cover all costs related to the return or exchange.
      </Text>
      <Text type="body1"><strong>Non-returnable items:</strong></Text>
      <ul>
        <li><Text type="body1">Coffee beans</Text></li>
        <li><Text type="body1">Filters</Text></li>
        <li><Text type="body1">Ready-to-drink beverages</Text></li>
      </ul>
      <Text type="body1"><strong>Specific Exceptions:</strong></Text>
      <Text type="body1">Contact us within 24 hours of receiving your order with documented proof in the following cases:</Text>
      <ul>
        <li><Text type="body1">Product is unusable (e.g., abnormal odor or unacceptable taste).</Text></li>
        <li><Text type="body1">Incorrect product delivered.</Text></li>
      </ul>
      <Text type="body1"><strong>Cases Beyond Our Responsibility:</strong></Text>
      <ul>
        <li><Text type="body1">Delivery delays caused by shipping or external service providers.</Text></li>
        <li><Text type="body1">Product damage due to poor storage or misuse after receipt.</Text></li>
        <li><Text type="body1">Spilled or damaged drinks during delivery via third-party services.</Text></li>
      </ul>
      <Text type="body1"><strong>Shipping Damage:</strong></Text>
      <Text type="body1">Shipping companies are fully responsible for any damage occurring during transit. Camel Step does not bear responsibility in such cases.</Text>

      <Text type="headline3">Delivery & Shipping Policy</Text>
      <ul>
        <li><Text type="body1"><strong>Within Riyadh:</strong> 24 hours</Text></li>
        <li><Text type="body1"><strong>Within Saudi Arabia (other regions):</strong> 3–5 business days</Text></li>
        <li><Text type="body1"><strong>GCC countries:</strong> 7 business days</Text></li>
        <li><Text type="body1"><strong>Rest of the world:</strong> 10–15 days</Text></li>
      </ul>
      <Text type="body1"><strong>Note:</strong> During promotions, shipping times may increase by an additional 5 business days.</Text>
      <Text type="body1"><strong>Delays & Damages:</strong></Text>
      <Text type="body1">Camel Step is not liable for delays or damages caused by shipping companies. Once a customer receives the shipment, it is considered confirmation that it was delivered in good condition and unopened</Text>
      <Text type="body1"><strong>Customs Duties:</strong></Text>
      <Text type="body1">Taxes and customs fees are calculated based on your shipping destination and are fully borne by the customer. Upon arrival, customers must pay all applicable import duties, customs, and local sales taxes.</Text>
      <Text type="body1"><strong>Refused Orders / Incorrect Address:</strong></Text>
      <Text type="body1">Customers will bear full shipping costs if the order is refused or incorrect address details are provided.</Text>

      <Text type="headline3">Training Policy</Text>
      <Text type="body1">At Camel Step, we offer enriching educational experiences for coffee enthusiasts.</Text>
      <Text type="body1"><strong>Cancellation:</strong></Text>
      <Text type="body1">You may cancel up to 3 days before the program starts for a full refund (if already paid).</Text>
      <Text type="body1"><strong>Rescheduling:</strong></Text>
      <Text type="body1">Possible based on trainer availability and minimum registration count, requested at least 3 days prior. After 5 days from registration, a 15% rescheduling fee applies.</Text>

      <Text type="headline3">Delivery & Installation Policy</Text>
      <Text type="body1">A customized service for a smoother experience:</Text>
      <Text type="body1"><strong>Installation Scheduling:</strong>Takes place within 5 business days or as agreed upon after confirming all setup requirements.</Text>
      <Text type="body1"><strong>Preparation:</strong>Ensure the site is ready for installation.</Text>
      <Text type="body1"><strong>Heavy Equipment:</strong>Delivered and installed on the ground floor only.</Text>
      <Text type="body1"><strong>Unprepared Sites:</strong>Rescheduling may incur additional fees.</Text>
      <Text type="body1"><strong>Storage:</strong>We can store equipment for up to 15 days. Longer periods will incur extra charges.</Text>

      <Text type="headline3">Warranty Policy</Text>
      <Text type="body1">At Camel Step, we offer a 2-year warranty on electrical equipment covering manufacturing defects.</Text>
      <Text type="body1"><strong>Conditions:</strong>Must present the original invoice. Devices must not be tampered with or serviced outside our centers.</Text>
      <Text type="body1"><strong>Exclusions:</strong>Damage from misuse, improper installation, or non-original parts.</Text>
      <Text type="body1"><strong>Timeframe:</strong>epairs within 15 business days, subject to delay if parts need to be imported</Text>
      <Text type="body1"><strong>Loaner Device:</strong>If repairs take more than 48 working hours, we provide a temporary replacement (subject to eligibility). The replacement must be returned once the original device is repaired.</Text>
      <Text type="body1"><strong>Replacement:</strong>If the same fault recurs, the device will be replaced with a similar one.</Text>
      <Text type="body1"><strong>Post-Warranty::</strong>We offer paid maintenance services.</Text>
      <Text type="body1"><strong>Contact Us:</strong></Text>
      <Text type="body1">For inquiries or support, contact us via:</Text>
      <ul>
        <li><Text type="body1"><strong>Phone or WhatsApp: </strong>920000689</Text></li>
        <li><Text type="body1"><strong>Contact Form:</strong>Available on our website</Text></li>
      </ul>

      <Text type="headline3">In-Store Pickup Policy (Not on Website Yet)</Text>
      <Text type="body1">At Camel Step, we offer the option to purchase products online and pick them up in-store, providing flexibility and convenience.</Text>
      <ul>
        <li><Text type="body1"><strong>Pickup Option:</strong>Available at select branches (based on product availability). Orders are prepared within 1 business day. If not picked up within 5 business days, the order will be canceled and restocked.</Text></li>
        <li><Text type="body1"><strong>ID Verification:</strong>Order number may be required for secure pickup.</Text></li>
        <li><Text type="body1"><strong>Unforeseen Branch Issues:</strong>If pickup is not possible, we can ship the order upon the customer’s request.</Text></li>
      </ul>

      <Text type="headline3">Payment Policy</Text>
      <Text type="body1">We offer secure and flexible payment methods for a seamless purchase experience:</Text>
      <Text type="body1"><strong>Available Methods:</strong>Mada, Visa, MasterCard, Apple Pay, STC Pay, and Cash on Delivery (in selected areas). All terms comply with Saudi Central Bank regulations.</Text>
      <Text type="body1"><strong>Installment Options:</strong>If using third-party financing, customers are responsible for adhering to their terms.</Text>
      <Text type="body1"><strong>Transaction Rejections:</strong>We reserve the right to cancel or reject suspicious transactions and will notify the customer accordingly.</Text>

      <Text type="headline3">Customer Service Policy</Text>
      <Text type="body1">Our team is with you every step of the way. We are committed to delivering professional and transparent customer support.</Text>
      <ul>
        <li>
          <Text type="body1"><strong>Working Hours: </strong>Daily from 9 AM to 12 Midnight</Text>
        </li>
        <li>
          <Text type="body1"><strong>Support Channels:</strong>WhatsApp, phone, and website contact form</Text>
        </li>
        <li>
          <Text type="body1"><strong>Response Time:</strong>Within 5 business days</Text>
        </li>
        <li>
          <Text type="body1"><strong>Feedback & Complaints:</strong>We welcome all suggestions and handle complaints with full confidentiality and a continuous improvement mindset.</Text>
        </li>
      </ul>

      <Text type="headline3">B2B Sales Policy</Text>
      <Text type="body1">At Camel Step, we believe successful partnerships are built on commitment, sustained through trust, and flourish when excellence meets authenticity.</Text>
      <Text type="body1">We have developed a comprehensive commercial partnership program for:Government and semi-government entities, private sector (for-profit and non-profit), companies, institutions, and the HORECA (Hospitality, Restaurant, and Café) sector.</Text>
      <Text type="body1">We offer:</Text>
      <ul>
        <li>
          <Text type="body1">Specialty coffee beans certified with the Saudi Quality Mark.</Text>
        </li>
        <li>
          <Text type="body1">Global equipment brands known for reliability and sustainability</Text>
        </li>
        <li>
          <Text type="body1">Transparent, value-driven relationships focused on product quality, partnership respect, and commitment</Text>
        </li>
      </ul>
      <Text type="body1"><strong>For Our Partners:</strong></Text>
      <ul>
        <li>
          <Text type="body1">High-quality roasted beans meeting global and local standards</Text>
        </li>
        <li>
          <Text type="body1">Flexible pricing strategies tailored to your business</Text>
        </li>
        <li>
          <Text type="body1">Consulting, training, and operational support</Text>
        </li>
        <li>
          <Text type="body1">Payment and delivery solutions aligned with your operations</Text>
        </li>
      </ul>

      <Text type="headline3">E-Commerce Policy</Text>
      <Text type="body1">At Camel Step, we are committed to providing a trusted online experience in compliance with Saudi Arabia’s regulations.</Text>
      <ul>
        <li>
          <Text type="body1"><strong>Transparency:</strong>Clear pricing, accurate product descriptions, and real product images, with full disclosure of return and exchange policies.</Text>
        </li>
        <li>
          <Text type="body1"><strong>Privacy:</strong>Customer data is handled per our privacy policy and is protected from unauthorized use.</Text>
        </li>
        <li>
          <Text type="body1"><strong>Consumer Protection:</strong> We comply with all Ministry of Commerce rights, including returns, cancellations, and refunds where applicable.</Text>
        </li>
        <li>
          <Text type="body1"><strong>Policy Updates:</strong>We reserve the right to update our policies, prices, or website content to serve the customer’s best interest and market dynamics</Text>
        </li>
      </ul>

      <Text type="headline3">Offers and Discounts Policy</Text>
      <Text type="body1">For promotions that include gifts, quantities are limited, and Camel Step reserves the right to replace the gift with another in case of stock depletion. The gift is automatically added to eligible orders based on availability and cannot be exchanged for cash or another product. Camel Step reserves the right to modify or discontinue promotions at any time without prior notice.</Text>

      <Text type="headline3">Compliance with rules and regulations</Text>
      <Text type="body1">All approved policies and procedures on the Camel Step website fully comply with the regulations and laws in force in the Kingdom of Saudi Arabia, including those of the Ministry of Commerce, the Communications and Information Technology Commission (CITC), and the Consumer Protection Authority. This ensures customer rights are protected and reinforces transparency and trust throughout the shopping experience.</Text>

      <Text type="body1">Contact us</Text>
      <Text type="body1">For enquiries or support, you can contact us via:</Text>
      <Text type="body1">Phone calls 920000689</Text>
      <Text type="body1">WhatsApp: 920000689</Text>
      <Text type="body1">Contact page</Text>
    </>
  );


  const content_ar = (
    <>
      <Helmet>
        <title>{t('seo.privacyPolicy.title')}</title>
        <meta name="description" content={t('seo.privacyPolicy.description')} />
      </Helmet>

      <Text type="headline2">السياسات والخصوصية</Text>

      {/* 1. سياسة الجودة */}
      <Text type="headline3">سياسة الجودة</Text>
      <Text type="body1">
        في خطوة جمل، نحن شغوفون بتقديم منتجات وخدمات عالية الجودة لا تقتصر على تلبية توقعات عملائنا في صناعة القهوة، بل تتجاوزها. نحن فخورون باتباع أعلى معايير الجودة مثل ISO 9001 لإدارة الجودة ISO 22000 لسلامة الغذاء، مما يضمن أن كل ما نقوم به يتم وفقًا لأعلى المعايير.
      </Text>
      <Text type="body1">إليك ما يمكنك توقعه منا:</Text>
      <ul>
        <li><Text type="body1"><strong>رضا العملاء في صميم عملنا:</strong> التزامنا في فهم احتياجاتك الفريدة وتقديم حلول مخصصة تضمن رضاك المستمر. رضاك هو ما يدفع شغفنا.</Text></li>
        <li><Text type="body1"><strong>سلامة الغذاء في مقدمة اهتمامنا:</strong> نطبق أفضل الممارسات في سلامة الغذاء، مما يضمن حماية كل خطوة في عملية الإنتاج لضمان سلامة منتجاتنا.</Text></li>
        <li><Text type="body1"><strong>التحسين المستمر والابتكار:</strong> نحن لا نكتفي بالوفاء بالمعايير؛ بل نسعى إلى وضعها. من خلال التقييم المستمر وتحسين عملياتنا، نظل ملتزمين بالابتكار والتميز.</Text></li>
        <li><Text type="body1"><strong>الدعم الموثوق ما بعد البيع:</strong> علاقتنا معك تمتد لما بعد البيع. نقدم لك التدريب والاستشارة وخدمات الصيانة لضمان تلبية احتياجاتك وضمان أفضل أداء لمنتجاتنا.</Text></li>
      </ul>
      <Text type="body1">
        من خلال دمج أفضل الممارسات من أنظمة إدارة الجودة وسلامة الغذاء، نحن نحقق التميز في جميع الأصعدة. ثق بنا كشريك لك في إنشاء منتجات آمنة وعالية الجودة وفي تحقيق نجاح مستدام.
      </Text>

      {/* 2. سياسة الخصوصية */}
      <Text type="headline3">سياسة الخصوصية</Text>
      <Text type="body1">
        خصوصيتك محل اهتمامنا، فنحن في خطوة جمل نلتزم بحماية بياناتك الشخصية بما يتوافق مع أنظمة حماية البيانات المعتمدة في المملكة العربية السعودية.
      </Text>
      <Text type="body1">
        جميع معلومات الدفع تُعالج بتشفير متقدم ولا تُخزن على خوادمنا، نستخدم بياناتك فقط لتحسين تجربتك، ولا نشاركها مع أي طرف ثالث دون موافقتك، إلا إذا تطلب النظام ذلك.
      </Text>
      <Text type="body1"><strong>أمن المعلومات:</strong> تتم جميع عمليات الدفع عبر بوابات إلكترونية موثوقة، باستخدام أحدث تقنيات التشفير لضمان حماية بيانات العملاء.</Text>

      {/* 3. سياسة حماية البيانات الشخصية */}
      <Text type="headline3">سياسة حماية البيانات الشخصية</Text>
      <Text type="body1">
        بياناتك مسؤوليتنا، فنحن فى خطوة جمل نلتزم بحماية بياناتك بكل مسؤولية وشفافية، ويشمل ذلك حقوقك التالية:
      </Text>
      <ul>
        <li><Text type="body1"><strong>حقك في المعرفة:</strong> معرفة كيفية جمع بياناتك والغرض من استخدامها.</Text></li>
        <li><Text type="body1"><strong>حقك في الوصول:</strong> الحصول على نسخة من بياناتك الشخصية.</Text></li>
        <li><Text type="body1"><strong>حقك في التصحيح:</strong> تحديث بياناتك غير الدقيقة.</Text></li>
        <li><Text type="body1"><strong>حقك في الإتلاف:</strong> حذف بياناتك إذا لم تعد هناك حاجة للاحتفاظ بها.</Text></li>
        <li><Text type="body1"><strong>حقك في سحب الموافقة:</strong> التراجع عن موافقتك على استخدام بياناتك في أي وقت.</Text></li>
      </ul>
      <Text type="body1">نؤكد لك أن بياناتك تُعالج بأقصى درجات الحماية من قبلنا.</Text>

      {/* 4. سياسة الطلب */}
      <Text type="headline3">سياسة الطلب</Text>
      <Text type="body1">
        مرونة في الطلبات تلبي راحتك فنحن نمنح عملائنا المرونة الكاملة في الطلب، يمكنك إلغاء الطلب واسترداد المبلغ كاملًا قبل الشحن، ويتم إرجاع المبلغ خلال 20 يوم عمل، أما بعد الشحن فتُطبق سياسة الإرجاع والاستبدال حسب أنظمة وزارة التجارة.
      </Text>

      {/* 5. سياسة الاستبدال والاسترجاع */}
      <Text type="headline3">سياسة الاستبدال والاسترجاع</Text>
      <Text type="body1">
        للاستفادة من خدمات الاستبدال والاسترجاع يجب إحضار الفاتورة، لا يحق للعميل استرجاع أو استبدال المنتجات حال شرائها أثناء العروض الترويجية، وفي حال وجود مشكلة في المنتج أو الجهاز تستدعي الاستبدال، فإن القيمة المتبعة هي قيمة المنتج أثناء العرض الترويجي.
      </Text>
      <Text type="body1">
        نضع رضاك في المقام الأول ونوفر إمكانية الاستبدال أو الاسترجاع خلال 7 أيام من الشراء وفق الشروط المذكورة.
      </Text>
      <Text type="body1"><strong>المنتجات غير القابلة للاسترجاع:</strong></Text>
      <ul>
        <li><Text type="body1">البن بجميع أنواعه</Text></li>
        <li><Text type="body1">الفلاتر</Text></li>
        <li><Text type="body1">المشروبات الجاهزة</Text></li>
      </ul>

      {/* 6. سياسة التوصيل والشحن */}
      <Text type="headline3">سياسة التوصيل والشحن</Text>
      <ul>
        <li><Text type="body1">داخل الرياض: 24 ساعة.</Text></li>
        <li><Text type="body1">داخل السعودية (باقي المناطق): 3-5 أيام عمل.</Text></li>
        <li><Text type="body1">لدول الخليج: 7 أيام عمل.</Text></li>
        <li><Text type="body1">لباقي دول العالم: 10-15 يومًا.</Text></li>
      </ul>
      <Text type="body1">ملاحظة: في حال وجود عروض قد تزيد مدة الشحن 5 أيام عمل.</Text>

      {/* 7. سياسة التدريب */}
      <Text type="headline3">سياسة التدريب</Text>
      <Text type="body1">فى خطوة جمل نقدم لك التجارب التعليمية القيّمة لعشاق القهوة.</Text>
      <ul>
        <li><Text type="body1"><strong>إلغاء التسجيل:</strong> قبل 3 أيام من بداية البرنامج.</Text></li>
        <li><Text type="body1"><strong>إعادة الجدولة:</strong> وفق توفر المدربين وبرسوم 15% بعد 5 أيام.</Text></li>
      </ul>

      {/* 8. سياسة التوصيل والتركيب */}
      <Text type="headline3">سياسة التوصيل والتركيب</Text>
      <ul>
        <li><Text type="body1">التركيب خلال 5 أيام عمل.</Text></li>
        <li><Text type="body1">الأجهزة الثقيلة للدور الأرضي فقط.</Text></li>
        <li><Text type="body1">التخزين حتى 15 يومًا.</Text></li>
      </ul>

      {/* 9. سياسة الضمان */}
      <Text type="headline3">سياسة الضمان</Text>
      <Text type="body1">ضمان سنتين على الأجهزة الكهربائية للأعطال المصنعية.</Text>

      {/* 10. سياسة الاستلام من الفرع */}
      <Text type="headline3">سياسة الاستلام من الفرع</Text>
      <Text type="body1">
        إمكانية شراء المنتجات عبر الموقع واستلامها من الفرع مباشرة دون شحن.
      </Text>

      {/* 11. سياسة الدفع */}
      <Text type="headline3">سياسة الدفع</Text>
      <Text type="body1">
        بطاقات مدى، فيزا، ماستركارد، Apple Pay، stc pay، والدفع عند الاستلام في بعض المناطق.
      </Text>

      {/* 12. سياسة خدمة العملاء */}
      <Text type="headline3">سياسة خدمة العملاء</Text>
      <ul>
        <li><Text type="body1">ساعات العمل: 9 صباحًا – 12 مساءً.</Text></li>
        <li><Text type="body1">قنوات التواصل: واتساب – مكالمات – نموذج الموقع.</Text></li>
        <li><Text type="body1">مدة الاستجابة: حتى 5 أيام.</Text></li>
      </ul>

      {/* 13. سياسة مبيعات الشركات */}
      <Text type="headline3">سياسة مبيعات الشركات</Text>
      <Text type="body1">
        برنامج شراكات تجارية يخدم الجهات الحكومية والخاصة وقطاع الضيافة.
      </Text>

      {/* 14. سياسة التجارة الإلكترونية */}
      <Text type="headline3">سياسة التجارة الإلكترونية</Text>
      <ul>
        <li><Text type="body1">الشفافية في الأسعار والمعلومات.</Text></li>
        <li><Text type="body1">حماية بيانات العملاء.</Text></li>
        <li><Text type="body1">الالتزام بحقوق المستهلك.</Text></li>
      </ul>

      {/* 15. سياسة العروض والخصومات */}
      <Text type="headline3">سياسة العروض والخصومات</Text>
      <Text type="body1">
        الهدايا محدودة وتضاف تلقائيًا ولا يمكن استبدالها نقدًا.
      </Text>

      {/* 16. التوافق مع الأنظمة */}
      <Text type="headline3">التوافق مع الأنظمة واللوائح</Text>
      <Text type="body1">
        جميع السياسات متوافقة مع أنظمة المملكة العربية السعودية.
      </Text>

      {/* Contact */}
      <Text type="headline3">التواصل معنا</Text>
      <Text type="body1">المكالمات الهاتفية: 920000689</Text>
      <Text type="body1">الواتساب: 920000689</Text>
      <Text type="body1">صفحة التواصل</Text>
    </>
  );

  return (
    <MainLayout>
      <div className="static_page policy-container">
        {i18n.language === 'en' ? content_en : content_ar}
      </div>
    </MainLayout>
  );
};