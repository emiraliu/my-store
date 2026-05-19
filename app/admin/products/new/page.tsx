import ProductForm from '../ProductForm'

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Add product</h1>
      <ProductForm />
    </div>
  )
}
