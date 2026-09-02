import LegalDocumentPage from "@/features/legal/components/LegalDocumentPage";

const blocks = [
  { type: "paragraph", text: "Chào mừng Quý khách hàng đến với SSCare," },
  {
    type: "paragraph",
    text: "Khi truy cập và sử dụng website/ứng dụng này, khách hàng đồng ý bị ràng buộc bởi các \"Điều kiện giao dịch chung/Điều khoản dịch vụ\" dưới đây. Chúng tôi có quyền sửa đổi, bổ sung hoặc thay đổi bất kỳ nội dung nào tại bất kỳ thời điểm nào và những thay đổi có hiệu lực ngay sau khi được đăng tải mà không cần thông báo trước. Việc tiếp tục sử dụng website/ứng dụng sau khi có cập nhật đồng nghĩa với việc khách hàng chấp thuận các thay đổi đó.",
  },
  { type: "paragraph", text: "Vui lòng đọc kỹ và thường xuyên cập nhật nội dung Điều kiện này để bảo vệ quyền lợi của chính mình." },
  { type: "heading", text: "1. Các điều kiện về việc cung cấp dịch vụ của website SSCare" },
  { type: "paragraph", text: "Dịch vụ được cung cấp dưới hình thức trả phí ứng dụng di động, cho phép người dùng tiếp cận các tính năng cao cấp mà website/ứng dụng cung cấp" },
  { type: "paragraph", text: "Mỗi gói dịch vụ có thời hạn sử dụng, chức năng cụ thể được công bố rõ ràng tại thời điểm đăng ký." },
  { type: "paragraph", text: "Việc đăng ký dịch vụ, đăng ký tài khoản người dùng được thực hiện hoàn toàn trực tuyến, thông qua tài khoản người dùng trên nền tảng SSCare. Người dùng cần đảm bảo cung cấp thông tin đầy đủ và chính xác theo yêu cầu." },
  { type: "heading", text: "2. Chính sách hủy đăng ký, hoàn tiền" },
  { type: "subheading", text: "a. Trường hợp hệ thống lỗi hoặc dịch vụ không đúng mô tả" },
  { type: "paragraph", text: "Nếu dịch vụ tại SSCare, không được cung cấp đúng như mô tả (ví dụ: tính năng không hoạt động, thời lượng sai lệch...) do lỗi hệ thống, khách hàng có quyền phản ánh tới bộ phận hỗ trợ trong vòng 48h kể từ thời điểm phát sinh sự cố. Sau khi xác minh, nếu lỗi thuộc về chúng tôi, khách hàng sẽ được gia hạn gói hoặc hoàn tiền theo lựa chọn." },
  { type: "subheading", text: "b. Trường hợp khách hàng hủy ngang" },
  { type: "paragraph", text: "Do đặc thù là dịch vụ số và được kích hoạt ngay sau thanh toán, chúng tôi không hoàn tiền trong trường hợp khách hàng tự ý hủy gói giữa chừng, đổi ý sau khi đăng ký, hoặc sử dụng không đúng mục đích. Tuy nhiên, nếu khách hàng chưa sử dụng bất kỳ quyền lợi nào của gói, có thể liên hệ để được chúng tôi sẽ xem xét hỗ trợ chuyển đổi sang các gói dịch vụ khác mà chúng tôi cung cấp trên nền tảng SSCare tuỳ điều kiện thực tế." },
  { type: "subheading", text: "c. Phương thức hoàn tiền:" },
  { type: "paragraph", text: "Trong trường hợp hoàn tiền cho khách hàng mà xác định được lỗi do hệ thống hoặc của chúng tôi, thì việc hoàn tiền sẽ được thực hiện theo phương thức khách hàng đã sử dụng để thanh toán (chuyển khoản, ví điện tử, cổng thanh toán bên thứ ba...). Thời gian hoàn trả từ 3–10 ngày làm việc tùy đơn vị trung gian xử lý. Mọi chi phí phát sinh từ việc hoàn tiền sẽ được hai bên thỏa thuận tại thời điểm phát sinh." },
  { type: "heading", text: "3. Các tiêu chuẩn về việc cung cấp dịch vụ và chất lượng dịch vụ." },
  { type: "paragraph", text: "Chúng tôi cam kết cung cấp đầy đủ tính năng, thời lượng, nội dung độc quyền đúng như mô tả đối với từng gói dịch vụ tại SSCare. Trong trường hợp dịch vụ bị gián đoạn ngoài ý muốn (lỗi kỹ thuật, bảo trì hệ thống,...), chúng tôi sẽ:" },
  { type: "list", items: ["Thông báo công khai thời gian gián đoạn.", "Hỗ trợ gia hạn gói hoặc bồi thường dịch vụ tương ứng với thời gian ảnh hưởng."] },
  { type: "heading", text: "4. Quyền và nghĩa vụ khách hàng" },
  { type: "subheading", text: "a. Quyền của khách hàng" },
  { type: "list", items: [
    "Khách hàng có quyền yêu cầu tư vấn về sản phẩm, dịch vụ; các thông tin về sản phẩm, dịch vụ một cách đầy đủ và rõ ràng nhất",
    "Được cung cấp đầy đủ thông tin về sản phẩm, dịch vụ, tính năng và chi phí trước khi thanh toán.",
    "Có quyền khiếu nại, phản hồi về chất lượng dịch vụ.",
    "Được yêu cầu hỗ trợ kỹ thuật trong quá trình sử dụng.",
  ] },
  { type: "subheading", text: "b. Nghĩa vụ của khách hàng" },
  { type: "list", items: [
    "Khách hàng có nghĩa vụ thanh toán đúng và đầy đủ các chi phí về giá thành dịch vụ, các chi phí phát sinh khác, ...",
    "Khi nhận hàng phải kiểm tra về sản phẩm, dịch vụ bao gồm: số lượng, chất lượng, tình trạng,... nhằm tránh phát sinh các vấn đề về sau. Nếu có các vấn đề phát sinh khác ngay lập tức phải thông báo cho chúng tôi biết để có hướng giải quyết phù hợp.",
    "Không chia sẻ, chuyển nhượng, bán lại tài khoản hoặc gói thành viên cho bên thứ ba.",
    "Không sử dụng tài khoản vào mục đích vi phạm pháp luật, đạo đức xã hội hoặc quy định nội bộ của nền tảng.",
  ] },
  { type: "heading", text: "5. Quyền và nghĩa vụ của chúng tôi" },
  { type: "subheading", text: "a. Chúng tôi có quyền" },
  { type: "list", items: [
    "Tạm ngưng hoặc chấm dứt dịch vụ đối với tài khoản vi phạm điều kiện sử dụng.",
    "Từ chối hỗ trợ trong trường hợp người dùng sử dụng dịch vụ sai mục đích, gian lận, gây ảnh hưởng tới hệ thống.",
    "Từ chối các yêu cầu của khách hàng về việc phải đáp ứng về chất lượng, dịch vụ, tư vấn về sản phẩm mà vượt quá khả năng của chúng tôi hoặc những yêu cầu đó là vi phạm pháp luật.",
    "Chúng tôi có quyền từ chối giao hàng ở các khoảng thời gian, địa điểm mà chúng tôi hoặc bên thứ ba (nhà cung cấp dịch vụ giao nhận) không thể thực hiện được. Chúng tôi sẽ liên hệ với khách hàng để thông báo tình trạng này.",
  ] },
  { type: "subheading", text: "b. Chúng tôi có nghĩa vụ" },
  { type: "list", items: [
    "Thực hiện đúng, đủ về số lượng, chất lượng, thời gian, địa điểm theo yêu cầu khách hàng.",
    "Thực hiện việc tư vấn cho khách hàng đầy đủ về sản phẩm, công dụng, … đảm bảo khách hàng hiểu rõ về sản phẩm.",
    "Theo dõi bên thứ ba để đảm bảo dịch vụ được hoàn tất, phối hợp với khách hàng, bên thứ ba để giải quyết các vấn để phát sinh.",
  ] },
  { type: "heading", text: "6. Giải quyết tranh chấp" },
  { type: "list", items: [
    "Mọi tranh chấp phát sinh sẽ được giải quyết trên tinh thần hợp tác, thương lượng.",
    "Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra giải quyết tại Tòa án nhân dân có thẩm quyền theo quy định pháp luật Việt Nam",
  ] },
  { type: "heading", text: "7. Thông tin liên hệ hỗ trợ" },
  { type: "contact", lines: ["Công ty Cổ phần Dịch vụ SSCare", "Hotline:", "Email:", "Địa chỉ:"] },
];

export default function TermsOfUse() {
  return (
    <LegalDocumentPage
      title="ĐIỀU KIỆN GIAO DỊCH CHUNG/ĐIỀU KHOẢN DỊCH VỤ"
      blocks={blocks}
    />
  );
}
