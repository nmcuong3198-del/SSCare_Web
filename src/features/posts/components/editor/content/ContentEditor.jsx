import "./ContentEditor.css";

import SectionCard from "@/features/posts/components/editor/content/SectionCard";
import AddSectionButton from "@/features/posts/components/editor/content/AddSectionButton";
import ConclusionEditor from "@/features/posts/components/editor/content/ConclusionEditor";

export default function ContentEditor({
    article,
    setArticle,
    readOnly,
}) {
    const sections = article.content || [];

    return (

        <>

            <div className="content-title">

                Nội dung chi tiết

            </div>

            {
                sections.map((section,index)=>(

                    <SectionCard

                        key={section.id}

                        index={index}

                        section={section}

                        readOnly={readOnly}

                        article={article}

                        setArticle={setArticle}

                    />

                ))
            }

            <AddSectionButton

                article={article}

                setArticle={setArticle}

                readOnly={readOnly}

            />

            <ConclusionEditor

                article={article}

                readOnly={readOnly}

                setArticle={setArticle}

            />

        </>

    );

}