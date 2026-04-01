export const validateIssue = (data) => {
  const errors = {};
  
  if (!data.propertyName || !data.propertyName.trim()) {
    errors.propertyName = 'Please select a property';
  }
  
  if (!data.category || !data.category.trim()) {
    errors.category = 'Please select a category';
  }
  
  if (!data.urgency) {
    errors.urgency = 'Please select urgency level';
  }
  
  if (!data.description || !data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Please provide more details (minimum 10 characters)';
  } else if (data.description.trim().length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }
  
  return errors;
};
