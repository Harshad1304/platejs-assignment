import { useState } from "react";
import MCQCard from "../MCQCard";
import AddQuestionDialog from "../AddQuestionDialog";
import { useEditorRef } from "platejs/react";
export const MCQ_ELEMENT = "mcq";
const MCQElement = ({ attributes, children, element }) => {
  const [editData, setEditData] = useState(null);

  const editor = useEditorRef();
  const handleEdit = (data) => {
    setEditData(data);
  };


  const handleEditQuestion = (updatedData) => {
    if (!editor) return;
    
   
    try {
      const path = editor.findPath(element);
      console.log(path)
      editor.tf.setNodes(
        { data: updatedData },
        { at: path }
      );
    } catch (error) {
      console.error('Error updating element:', error);
    }

    setEditData(null);
  };

  return (
    <div {...attributes} contentEditable={false}>
      <MCQCard onEdit={handleEdit} data={element.data} />
      {children}

      {editData && (
        <AddQuestionDialog
          open={true}
          initialValues={editData}
          onClose={() => setEditData(null)}
          onSubmit={handleEditQuestion}
        />
      )}
    </div>
  );
};

export default MCQElement;
