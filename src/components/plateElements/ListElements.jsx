import { PlateElement } from "platejs/react";


export const UnorderedListElement = (props) => (
    <PlateElement as="ul" {...props} style={{ paddingLeft: '24px', listStyleType: 'disc' }} />
  );
  
  export const OrderedListElement = (props) => (
    <PlateElement as="ol" {...props} style={{ paddingLeft: '24px', listStyleType: 'decimal' }} />
  );
  
  export const ListItemElement = (props) => (
    <PlateElement as="li" {...props} />
    );

export const BulletedListElement  = (props) => (
    <PlateElement as="ul" {...props} style={{ paddingLeft: '24px', listStyleType: 'disc' }} />
  );

  export const NumberedListElement = (props) => (
    <PlateElement as="ol" {...props} style={{ paddingLeft: '24px', listStyleType: 'decimal' }} />
  );

  export const TaskListElement = (props) => {
    return (
      <PlateElement
        as="ol"
        {...props}
        className="pl-6 list-decimal" 
      >
        {props.children.map((child, index) => (
          <li key={index} className="flex items-start gap-2">
            <input type="checkbox" className="mt-1 w-4 h-4" />
            <div>{child}</div>
          </li>
        ))}
      </PlateElement>
    );
  };