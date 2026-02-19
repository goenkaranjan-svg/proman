import { getProperties } from "./actions";
import { PropertiesView } from "./_components/PropertiesView";

export default async function PropertiesPage() {
  const { data: properties, error } = await getProperties();

  return (
    <PropertiesView
      properties={properties ?? []}
      error={error}
    />
  );
}
