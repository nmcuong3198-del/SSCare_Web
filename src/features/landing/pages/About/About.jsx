import familyImage from "@/assets/landing/about-family.webp";

import "./About.css";

const ABOUT_PARAGRAPHS = [
  "Tuổi dậy thì là một trong những giai đoạn quan trọng nhất trong hành trình trưởng thành của mỗi đứa trẻ. Đây là thời điểm các con trải qua những bước chuyển mình mạnh mẽ về thể chất, tâm lý, cảm xúc và các mối quan hệ xã hội. Tuy nhiên, hành trình này không chỉ thử thách các con mà còn khiến không ít bậc cha mẹ cảm thấy bối rối khi thấy con bỗng trở nên khép kín, nhạy cảm hoặc có những hành vi khác biệt so với trước đây.",
  "Thực tế, những khoảng cách hay bất đồng trong gia đình giai đoạn này không xuất phát từ việc thiếu thấu cảm hay yêu thương, mà phần lớn đến từ việc cha mẹ thiếu thông tin, thiếu công cụ khoa học và sự hỗ trợ phù hợp để bắt kịp những thay đổi nhanh chóng của con.",
  "Đó là lý do SSCare được xây dựng – với mong muốn trở thành người bạn đồng hành đáng tin cậy của mọi gia đình trong giai đoạn đặc biệt này.",
  "Chúng tôi cung cấp hệ sinh thái kiến thức, thông tin và các công cụ hỗ trợ thiết thực, giúp phụ huynh hiểu rõ hơn về lộ trình phát triển của con, nhận biết sớm những thay đổi đáng chú ý để có phương pháp đồng hành phù hợp. Thông qua các nội dung được chọn lọc chuyên sâu, các bài viết chuyên đề, tình huống thực tế và những nguồn tham khảo đáng tin cậy, SSCare sẽ giúp cha mẹ tự tin hơn trên hành trình nuôi dạy con tuổi dậy thì.",
  "Tại SSCare, chúng tôi tin rằng mỗi đứa trẻ đều cần được lắng nghe, thấu hiểu và nâng đỡ đúng lúc. Khi cha mẹ hiểu con, khoảng cách giữa các thế hệ sẽ được xoá nhòa, các khó khăn sẽ được phát hiện sớm và giải quyết kịp thời, tạo điều kiện cho trẻ phát triển toàn diện nhất về cả thể chất, tinh thần lẫn kỹ năng sống.",
];

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="container about-hero-container">
          <div className="about-image-frame">
            <img
              src={familyImage}
              alt="Cha và con trai trò chuyện, chia sẻ với nhau"
              className="about-image"
            />
          </div>

          <div className="about-heading">
            <h1 id="about-title">
              SSCare – Đồng hành cùng gia đình trong hành trình tuổi dậy thì
            </h1>
            <span className="about-heading-line" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="about-story" aria-label="Câu chuyện về SSCare">
        <div className="about-content">
          {ABOUT_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <p className="about-mission">
            Sứ mệnh của SSCare là đồng hành cùng 1 triệu gia đình Việt Nam,
            giúp thế hệ trẻ tuổi dậy thì trưởng thành khỏe mạnh, tự tin và hạnh
            phúc.
          </p>

          <p>
            Sự thay đổi tích cực của xã hội luôn bắt đầu từ những bước chuyển
            mình nhỏ trong mỗi gia đình. Và hành trình đó luôn cần sự đồng hành.
          </p>

          <p className="about-slogan">
            SSCare – Thấu hiểu để đồng hành, đồng hành để trưởng thành.
          </p>

          <div className="about-cta-wrap">
            <a className="about-cta" href="/download">
              Khám phá các công cụ hỗ trợ của SSCare ngay hôm nay!
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
