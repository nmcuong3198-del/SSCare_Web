import "./StatisticCard.css";

export default function StatisticCard({

    icon,

    title,

    value,

    subTitle,

    color,

    dark = false,

}){

    return(

        <div
            className={
                dark
                ? "statistic-card dark-card"
                : "statistic-card"
            }
        >

            <div
                className="card-icon"
                style={{
                    background: color
                }}
            >

                {icon}

            </div>

            <div className="card-content">

                <span className="card-title">

                    {title}

                </span>

                <h2>

                    {value}

                </h2>

                {

                    subTitle && (

                        <p>

                            {subTitle}

                        </p>

                    )

                }

            </div>

        </div>

    );

}