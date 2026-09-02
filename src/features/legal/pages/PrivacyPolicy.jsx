import LegalDocumentPage from "@/features/legal/components/LegalDocumentPage";

const blocks = [
  {
    type: "paragraph",
    text: "SSCare cam kết sẽ bảo mật những thông tin mang tính riêng tư của khách hàng. Quý khách vui lòng đọc bản “Chính sách bảo mật thông tin” dưới đây để hiểu hơn những cam kết mà SSCare thực hiện, nhằm tôn trọng và bảo vệ quyền lợi của người truy cập.",
  },
  {
    type: "paragraph",
    text: "Bằng việc đăng ký thông tin cá nhân để sử dụng website/ứng dụngSSCare, đồng nghĩa là Quý khách đã thừa nhận, đồng ý tuân thủ và tin tưởng vào chính sách bảo mật này, cũng như những chỉnh sửa, thay đổi đi kèm.",
  },
  { type: "heading", text: "1. Thu thập thông tin cá nhân" },
  { type: "subheading", text: "a. Mục đích thu thập thông tin cá nhân" },
  { type: "paragraph", text: "Các thông tin thu thập thông qua nền tảng SSCare sẽ giúp chúng tôi:" },
  {
    type: "list",
    items: [
      "Hỗ trợ khách hàng khi đăng ký sử dụng website/ứng dụng SSCare",
      "Cung cấp cho khách hàng thông tin mới nhất trên website/ứng dụng SSCare;",
      "Cung cấp các dịch vụ mà khách hàng đăng ký;",
      "Giải đáp thắc mắc của khách hàng; liên hệ xử lý sự cố, phản ánh của khách hàng;",
      "Thực hiện các khảo sát người dùng để nâng cấp chất lượng dịch vụ;",
      "Đảm bảo an toàn thông tin và hỗ trợ các các giao dịch thanh toán trực tuyến của khách hàng;",
      "Thực hiện các hoạt động quảng bá liên quan đến các sản phẩm và dịch vụ của website/ứng dụng SSCare",
    ],
  },
  { type: "subheading", text: "b. Cách thức thu thập thông tin" },
  {
    type: "paragraph",
    text: "Để đăng ký sử dụng website/ứng dụng SSCare, Quý khách có thể sẽ được yêu cầu đăng ký một số thông tin cá nhân (Họ tên, Ngày tháng năm sinh,Tài khoản Email, Số điện thoại liên lạc,…). Mọi thông tin Quý khách khai báo phải đảm bảo tính chính xác và hợp pháp.",
  },
  {
    type: "paragraph",
    text: "SSCare cũng có thể thu thập thông tin Cookies mà trình duyệt web (browser) Quý khách sử dụng mỗi khi truy cập vào website/ứng dụng SSCare, bao gồm: địa chỉ IP, loại Browser, ngôn ngữ sử dụng, thời gian,... và những địa chỉ mà browser truy xuất đến nhằm mục đích trả lại trạng thái này cho khách hàng khi truy cập lần sau.",
  },
  {
    type: "paragraph",
    text: "Nếu Khách hàng đặt mua sản phẩm hoặc dịch vụ của SSCare, Chúng tôi có thể yêu cầu Khách hàng cung cấp thông tin liên quan đến việc thực hiện giao dịch. Trong một số trường hợp, Chúng tôi cũng có thể yêu cầu Khách hàng gửi thông tin bổ sung cho Chúng tôi hoặc trả lời các câu hỏi bổ sung để giúp xác minh thông tin của Khách hàng. Một số thông tin từ việc sử dụng dịch vụ của Khách hàng như:",
  },
  {
    type: "list",
    items: [
      "Thông tin tài chính như số tài khoản ngân hàng, số thẻ ghi nợ hoặc thẻ tín dụng,... nhằm kết nối thanh toán với ngân hàng.",
      "Thông tin thiết bị: kiểu phần cứng, số IMEI, và các yếu tố nhận dạng thiết bị, địa chỉ MAC, địa chỉ IP, phiên bản hệ điều hành và cài đặt thiết bị mà Khách hàng sử dụng để truy cập Dịch vụ.",
      "Thông tin đăng nhập: như thời gian và thời lượng Khách hàng sử dụng dịch vụ, và bất kỳ thông tin nào khác được lưu trữ trong cookie trên thiết bị của Khách hàng.",
      "Thông tin giao dịch: khi Khách hàng sử dụng dịch vụ để thực hiện giao dịch, Chúng tôi có thể thu thập thông tin về giao dịch đó, bao gồm: ngày, giờ và số tiền giao dịch, thiết bị mà Khách hàng sử dụng giao dịch và dịch vụ mà Khách hàng đã mua, đường dẫn mà Khách hàng chọn để liên kết với giao dịch, loại phương thức thanh toán đã sử dụng,...",
    ],
  },
  {
    type: "paragraph",
    text: "Mọi thông tin khai báo phải đảm bảo tính chính xác và hợp pháp. SSCare không chịu mọi trách nhiệm liên quan đến pháp luật của thông tin khai báo.",
  },
  { type: "heading", text: "2. Sử dụng thông tin cá nhân" },
  {
    type: "paragraph",
    text: "SSCare thu thập và sử dụng thông tin cá nhân quý khách với mục đích phù hợp và hoàn toàn tuân thủ nội dung của “Chính sách bảo mật thông tin” này.",
  },
  {
    type: "paragraph",
    text: "Trong trường hợp cần thiết, SSCare có thể sử dụng những thông tin này để liên hệ trực tiếp với Quý khách dưới các hình thức như: điện thoại, gửi thư ngỏ, đơn đặt hàng, thư cảm ơn, thông tin về kỹ thuật và bảo mật…",
  },
  { type: "heading", text: "3. Thời gian lưu trữ thông tin" },
  {
    type: "paragraph",
    text: "Thông tin về tài khoản, thời gian đăng nhập, địa chỉ của người sử dụng và nhật ký hoạt động được lưu trữ tại SSCare trong thời gian tối thiểu là 02 (hai) năm; Sau khi hết hạn thời gian lưu trữ, hệ thống máy chủ của công ty sẽ thực hiện việc xóa thông tin của người sử dụng dịch vụ tại Việt Nam theo đúng quy định tại pháp .",
  },
  { type: "heading", text: "4. Chia sẻ thông tin cá nhân" },
  {
    type: "paragraph",
    text: "Ngoại trừ các trường hợp về sử dụng thông tin cá nhân như đã nêu trong chính sách này, SSCare cam kết sẽ không tiết lộ thông tin cá nhân của Quý khách ra bên ngoài. Mọi hành vi thu thập, lưu trữ, sử dụng, chia sẻ hay chuyển giao dữ liệu cá nhân ra bên ngoài doanh nghiệp đều phải được sự đồng ý của chủ thể dữ liệu.",
  },
  { type: "paragraph", text: "Ngoài ra, việc cung cấp thông tin cá nhân của Quý khách sẽ được thực hiện trong các trường hợp cần thiết như sau:" },
  {
    type: "list",
    items: [
      "Khi có yêu cầu của các cơ quan Nhà nước có thẩm quyền;",
      "Trong trường hợp mà SSCare cần bảo vệ quyền lợi chính đáng của mình trước pháp luật;",
      "Tình huống khẩn cấp và cần thiết để bảo vệ quyền an toàn cá nhân của các khách hàng SSCare.",
    ],
  },
  { type: "heading", text: "5. Bảo mật thông tin cá nhân" },
  {
    type: "paragraph",
    text: "Khi Quý khách đăng ký thông tin cá nhân cho chúng tôi, Quý khách đã đồng ý với các điều khoản mà chúng tôi đã nêu ở trên. SSCare cam kết bảo mật thông tin cá nhân của Quý khách bằng mọi cách thức có thể. Chúng tôi sẽ sử dụng nhiều công nghệ bảo mật thông tin theo chuẩn quốc tế nhằm bảo vệ thông tin này không bị truy lục, sử dụng hoặc tiết lộ ngoài ý muốn.",
  },
  {
    type: "paragraph",
    text: "Tuy nhiên do hạn chế về mặt kỹ thuật, không một dữ liệu nào có thể được truyền trên đường truyền internet có thể được bảo mật 100%. Do vậy, SSCare không thể đưa ra một cam kết chắc chắn rằng thông tin quý khách cung cấp cho chúng tôi sẽ được bảo mật một cách tuyệt đối an toàn. SSCare không chịu trách nhiệm trong trường hợp có sự truy cập trái phép thông tin cá nhân của Quý khách như các trường hợp Quý khách tự ý chia sẻ thông tin với người khác. Trong trường hợp Quý khách không đồng ý với các điều khoản nêu trên, chúng tôi khuyến nghị Quý khách không nên tiếp tục sử dụng dịch vụ và hạn chế cung cấp bất kỳ thông tin cá nhân nào trên nền tảng SSCare để tránh các ràng buộc pháp lý và quyền lợi phát sinh.",
  },
  {
    type: "paragraph",
    text: "Quý khách có trách nhiệm tự bảo mật các thông tin liên quan đến tài khoản và mật khẩu truy cập dịch vụ, và không chia sẻ với bất kỳ người nào khác. SSCare cung cấp công cụ đổi mật khẩu và khuyến cáo Quý khách nên thường xuyên đổi mật khẩu truy cập để đảm bảo thông tin cá nhân. SSCare không chịu trách nhiệm trong trường hợp Quý khách không truy cập sử dụng được dịch vụ do để lộ mật khẩu. Nếu sử dụng máy tính chung nhiều người, quý khách nên đăng xuất, hoặc thoát hết tất cả cửa sổ Website/ứng dụng đang mở.",
  },
  { type: "heading", text: "6. Truy xuất thông tin cá nhân" },
  {
    type: "paragraph",
    text: "Bất cứ thời điểm nào Quý khách cũng có thể truy cập và chỉnh sửa những thông tin cá nhân của mình khi đã đăng ký/đăng nhập tài khoản tại website/ứng dụng SSCare trước đó.",
  },
  { type: "heading", text: "7. Quy định về “Spam”" },
  {
    type: "paragraph",
    text: "SSCare khẳng định chỉ gửi các tin nhắn, email đến Quý khách khi và chỉ khi Quý khách có đăng ký hoặc sử dụng dịch vụ từ hệ thống của chúng tôi.",
  },
  {
    type: "paragraph",
    text: "SSCare cam kết không bán, thuê lại hoặc cho thuê thông tin của Quý khách đến bên thứ ba. Nếu Quý khách vô tình nhận được những tin nhắn, email không theo yêu cầu từ hệ thống chúng tôi do một nguyên nhân ngoài ý muốn, xin vui lòng không nhấn vào các link không rõ hoặc từ chối nhận các tin nhắn, email lạ này và hoặc thông báo trực tiếp đến Ban biên tập, ban quản trị SSCare.",
  },
  { type: "heading", text: "8. Thay đổi về chính sách" },
  {
    type: "paragraph",
    text: "Chúng tôi hoàn toàn có thể thay đổi nội dung Chính sách bảo mật thông tin công bố tại website/ứng dụng này mà không cần phải thông báo trước để phù hợp với các nhu cầu hoạt động của website cũng như nhu cầu và sự phản hồi từ khách hàng nếu có. Khi cập nhật nội dung chính sách này, chúng tôi sẽ chỉnh sửa lại thời gian “Cập nhật lần cuối” bên dưới.",
  },
  { type: "paragraph", text: "Nội dung “Chính sách bảo mật thông tin” này chỉ áp dụng tại Website/Ứng dụng SSCare" },
  {
    type: "paragraph",
    text: "Chúng tôi khuyến khích Quý khách đọc kỹ chính sách An toàn và Bảo mật của các trang website/ứng dụng của bên thứ ba trước khi cung cấp thông tin cá nhân cho các trang website/ứng dụng đó. SSCare không chịu trách nhiệm dưới bất kỳ hình thức nào về nội dung và tính pháp lý của trang webiste/ứng dụng thuộc bên thứ ba.",
  },
  { type: "heading", text: "9. Thông tin liên hệ" },
  { type: "paragraph", text: "SSCare luôn hoan nghênh các ý kiến đóng góp, liên hệ và phản hồi thông tin từ Quý khách về “Chính sách bảo mật thông tin”." },
  { type: "paragraph", text: "Nếu Quý khách có những thắc mắc liên quan, xin vui lòng liên hệ theo địa chỉ:" },
  {
    type: "contact",
    lines: [
      "Công ty Cổ Phần Dịch vụ SSCare",
      "Hotline: 0393546038",
      "Email:",
      "Địa chỉ: Số 232 dãy C13 Tổ 1, Phường Long Biên, Thành phố Hà Nội",
      "Trân trọng!",
      "Ban quản trị SSCare",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalDocumentPage
      title="CHÍNH SÁCH BẢO MẬT"
      introNote="(Lưu ý: Nội dung đảm bảo yếu tố pháp luật quy định hiện hành, Công ty có thể bổ sung những nội dung cần thiết để phù hợp với chính sách riêng của Công ty)"
      blocks={blocks}
    />
  );
}
