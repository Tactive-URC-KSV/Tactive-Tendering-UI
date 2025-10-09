import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResourceModal from '../Utills/ResourceModal';
import useResourceModal from '../Utills/useResourceModal';

function ResourceAdding() {
  const { projectId, costCodeId } = useParams();
  const isGlobal = !projectId; 
  const {
    costCode,
    resourceData,
    setResourceData,
    showResourceAdding,
    setShowResourceAdding,
    coEffdisabled,
    uomOption,
    resourceTypesOption,
    resourceNatureOption,
    resourceOption,
    quantityTypeOption,
    currencyOption,
    handleResourceTypeChange,
    handleQuantityTypeChange,
    handleCalculations,
    handleAddResource,
    fetchResource,
  } = useResourceModal(isGlobal);

  useEffect(() => {
    setShowResourceAdding(true);
  }, []);

  return (
    <ResourceModal
      showModal={showResourceAdding}
      setShowModal={setShowResourceAdding}
      resourceData={resourceData}
      setResourceData={setResourceData}
      resourceTypesOption={resourceTypesOption}
      resourceNatureOption={resourceNatureOption}
      resourceOption={resourceOption}
      uomOption={uomOption}
      quantityTypeOption={quantityTypeOption}
      currencyOption={currencyOption}
      coEffdisabled={coEffdisabled}
      handleResourceTypeChange={handleResourceTypeChange}
      handleQuantityTypeChange={handleQuantityTypeChange}
      handleCalculations={handleCalculations}
      handleAddResource={handleAddResource}
      fetchResource={fetchResource}
    />
  );
}

export default ResourceAdding;