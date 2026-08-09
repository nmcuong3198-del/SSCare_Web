import "./StatisticCard.css";

export default function StatisticCard({
    icon,
    title,
    value,
    color = "#173B92"
}) {

    return (
        <div className="stat-card">

            <div
                className="stat-icon"
                style={{ background: color }}
            >
                {icon}
            </div>

            <div>

                <div className="stat-title">
                    {title}
                </div>

                <div className="stat-value">
                    {value}
                </div>

            </div>

        </div>
    );
}