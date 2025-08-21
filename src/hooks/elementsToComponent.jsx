import MCQElement, { MCQ_ELEMENT } from "../components/plateElements/MCQElement";

export function elementToComponent(element, props) {
    switch (element.type) {
      case MCQ_ELEMENT:
        return <MCQElement {...props} />;
      default:
        return <div {...props.attributes}>{props.children}</div>;
    }
  }