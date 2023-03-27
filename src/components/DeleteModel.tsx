import lockContainerIcon from "@assets/lockContainer.svg";
import "@css/deletemodel.css";
import Input from "@components/Input";
import Button from "@components/Button";
import { StateUpdater, useRef } from "preact/hooks";
import { ChangeEvent } from "preact/compat";
import { deleteTemplate } from "@api/ses";

interface Props {
  setIsDeleteClick: StateUpdater<{
    isDeleteModel: boolean;
    templateName: string;
  }>;
  templateName: string;
}

const DeleteModel = ({ templateName, setIsDeleteClick }: Props) => {
  const deleteRef = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);

  // hide model when clicked outside
  window.onclick = (e) => {
    if (e.target === deleteRef.current) {
      setIsDeleteClick({ isDeleteModel: false, templateName });
    }
  };
  // console.log(templateName);

  const handleDelete = async (e: ChangeEvent) => {
    e.preventDefault();
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const formDataObj = Object.fromEntries(formData.entries());
        const templateInputName = formDataObj.templateInputName;
        console.log(templateInputName);
        if (templateInputName === templateName) {
          await deleteTemplate({ TemplateName: templateInputName });
          console.log(`${templateInputName} is deleted successfully`);
          setIsDeleteClick({ isDeleteModel: false, templateName });
        } else {
          console.log("template name not matched");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="delete-model-container" ref={deleteRef}>
      <div className="delete-model-wrapper">
        <div className="delete-head-wrapper">
          <img src={lockContainerIcon} alt="lockicon" />
          <h2 className="delete-tittle">Delete {templateName}?</h2>
        </div>
        <div className="delete-content-wrapper">
          <p>
            Are you sure you want to permanently delete {templateName}? This is
            irreversible, make sure to take a backup if you change your mind.
          </p>
          <form onSubmit={handleDelete} ref={formRef}>
            <Input
              type="text"
              name="templateInputName"
              placeholder="Enter your email template name to proceed"
              label="Your template name"
            />
            <Button type="submit" label="Delete this template" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteModel;