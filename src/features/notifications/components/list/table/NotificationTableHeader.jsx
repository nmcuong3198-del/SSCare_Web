import "./NotificationTableHeader.css";

export default function NotificationTableHeader({

    total,

}){

    return(

        <div className="notification-table-header">

            <div>

                <h3>

                    Danh sách thông báo

                </h3>

                <p>

                    Tổng cộng

                    <strong>

                        {" "}

                        {total}

                    </strong>

                    {" "}thông báo

                </p>

            </div>

        </div>

    );

}