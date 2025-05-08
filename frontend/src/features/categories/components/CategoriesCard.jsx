import React from "react";
import CategoryIcon from "../../../components/ui/Icon";
import { Link } from "react-router";

const CategoriesCard = ({ id, category, iconClassName }) => {
  if (!category) return null;
  
  return (
    <Link to={`products/category/${id}`} className="mx-3">
      <div className="card card-compact w-24 h-24 border hover:border-primary transition-colors">
        <div className="card-body items-center justify-center">
          <CategoryIcon iconName={category.icon} className={iconClassName} />
          <p className="text-xs text-center">{category.name}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoriesCard;
