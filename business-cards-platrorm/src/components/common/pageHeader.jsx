import "../../style/pageHeader.css";

function PageHeader({ title, description }) {
  return (
    <div className="my-3 text-center font-type">
      <h1>{title}</h1>

      {description && <div>{description}</div>}
    </div>
  );
}

export default PageHeader;
