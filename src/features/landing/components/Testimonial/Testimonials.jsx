import "./Testimonials.css";

const reviews = [
  {
    avatar: "MH",
    name: "Chị Minh Hằng",
    role: "Mẹ của Bé Na (13 tuổi)",
    review:
      "SSCare đã giúp tôi hiểu được những thay đổi hormone ảnh hưởng thế nào đến cảm xúc của con. Giờ đây, những bữa cơm gia đình không còn là những cuộc tranh cãi căng thẳng nữa."
  },
  {
    avatar: "QT",
    name: "Anh Quốc Tuấn",
    role: "Bố của bé Bin (15 tuổi)",
    review:
      "Cảm ơn đội ngũ chuyên gia của SSCare. Những gợi ý hành động ngắn gọn, dễ hiểu đã giúp một ông bố vụng về như tôi biết cách bắt chuyện và tâm sự cùng con trai."
  },
  {
    avatar: "TL",
    name: "Chị Thùy Linh",
    role: "Mẹ của Bé Gạo (14 tuổi)",
    review:
      "Tính năng theo dõi sức khỏe và cảm nhận tâm lý mỗi ngày cực kỳ hữu ích. Nó giống như một cầu nối vô hình giúp mẹ con mình hiểu nhau mà không cần nói quá nhiều."
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials" data-aos="zoom-in">

      <div className="container">

        <div className="testimonial-header">

          <div>

            <h2>Nhận xét của phụ huynh</h2>

            <p>
              Những câu chuyện thật từ những gia đình SSCare đã đồng hành
            </p>

          </div>

          <div className="arrow-group">

            <button>❮</button>

            <button>❯</button>

          </div>

        </div>

        <div className="testimonial-grid">

          {reviews.map((item, index) => (

            <div className="testimonial-card" key={index}>

              <div className="stars">
                ★★★★★
              </div>

              <p className="review">
                "{item.review}"
              </p>

              <div className="user">

                <div className="avatar">
                  {item.avatar}
                </div>

                <div>

                  <h4>{item.name}</h4>

                  <span>{item.role}</span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}