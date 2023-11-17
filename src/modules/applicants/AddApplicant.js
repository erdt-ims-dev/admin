import { Button } from "react-bootstrap";
import Breadcrumbs from "../generic/breadcrumb";
import "./style.scss";

// TODO

const AddApplicant = () => {
  return (
    <div className="add-applicant">
      <Breadcrumbs header="Create application" subheader="1st semester 2023" />
      <Button>Create</Button>
    </div>
  );
};

export default AddApplicant;
