"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import {
  useDocument,
  useEditDocument,
  useDocumentProjection,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PublishButton,
  RevertButton,
  ImageUploader,
  DeleteButton,
} from "@/components/admin";

const MATERIALS = [
  { value: "wood", label: "Wood" },
  { value: "metal", label: "Metal" },
  { value: "fabric", label: "Fabric" },
  { value: "leather", label: "Leather" },
  { value: "glass", label: "Glass" },
];

const COLORS = [
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "oak", label: "Oak" },
  { value: "walnut", label: "Walnut" },
  { value: "grey", label: "Grey" },
  { value: "natural", label: "Natural" },
];

// Field editor components
function NameEditor(handle: DocumentHandle) {
  const { data: name } = useDocument({ ...handle, path: "name" });
  const editName = useEditDocument({ ...handle, path: "name" });

  return (
    <Input
      value={(name as string) ?? ""}
      onChange={(e) => editName(e.target.value)}
      placeholder="Product name"
    />
  );
}

function SlugEditor(handle: DocumentHandle) {
  const { data: slug } = useDocument({ ...handle, path: "slug" });
  const editSlug = useEditDocument({ ...handle, path: "slug" });
  const slugValue = (slug as { current?: string })?.current ?? "";

  return (
    <Input
      value={slugValue}
      onChange={(e) => editSlug({ _type: "slug", current: e.target.value })}
      placeholder="product-slug"
    />
  );
}

function DescriptionEditor(handle: DocumentHandle) {
  const { data: description } = useDocument({ ...handle, path: "description" });
  const editDescription = useEditDocument({ ...handle, path: "description" });

  return (
    <Textarea
      value={(description as string) ?? ""}
      onChange={(e) => editDescription(e.target.value)}
      placeholder="Product description..."
      rows={4}
    />
  );
}

function PriceEditor(handle: DocumentHandle) {
  const { data: price } = useDocument({ ...handle, path: "price" });
  const editPrice = useEditDocument({ ...handle, path: "price" });

  return (
    <Input
      type="number"
      step="0.01"
      min="0"
      value={(price as number) ?? ""}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        editPrice(parseFloat(e.target.value) || 0)
      }
      placeholder="0.00"
    />
  );
}

function StockEditor(handle: DocumentHandle) {
  const { data: stock } = useDocument({ ...handle, path: "stock" });
  const editStock = useEditDocument({ ...handle, path: "stock" });

  return (
    <Input
      type="number"
      min="0"
      value={(stock as number) ?? 0}
      onChange={(e) => editStock(parseInt(e.target.value) || 0)}
      placeholder="0"
    />
  );
}

function MaterialEditor(handle: DocumentHandle) {
  const { data: material } = useDocument({ ...handle, path: "material" });
  const editMaterial = useEditDocument({ ...handle, path: "material" });

  return (
    <Select
      value={(material as string) ?? ""}
      onValueChange={(value) => editMaterial(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select material" />
      </SelectTrigger>
      <SelectContent>
        {MATERIALS.map((m) => (
          <SelectItem key={m.value} value={m.value}>
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ColorEditor(handle: DocumentHandle) {
  const { data: color } = useDocument({ ...handle, path: "color" });
  const editColor = useEditDocument({ ...handle, path: "color" });

  return (
    <Select
      value={(color as string) ?? ""}
      onValueChange={(value) => editColor(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select color" />
      </SelectTrigger>
      <SelectContent>
        {COLORS.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DimensionsEditor(handle: DocumentHandle) {
  const { data: dimensions } = useDocument({ ...handle, path: "dimensions" });
  const editDimensions = useEditDocument({ ...handle, path: "dimensions" });

  return (
    <Input
      value={(dimensions as string) ?? ""}
      onChange={(e) => editDimensions(e.target.value)}
      placeholder='e.g., "120cm x 80cm x 75cm"'
    />
  );
}

function FeaturedEditor(handle: DocumentHandle) {
  const { data: featured } = useDocument({ ...handle, path: "featured" });
  const editFeatured = useEditDocument({ ...handle, path: "featured" });

  return (
    <Switch
      checked={(featured as boolean) ?? false}
      onCheckedChange={(checked: boolean) => editFeatured(checked)}
    />
  );
}

function AssemblyEditor(handle: DocumentHandle) {
  const { data: assemblyRequired } = useDocument({
    ...handle,
    path: "assemblyRequired",
  });
  const editAssembly = useEditDocument({
    ...handle,
    path: "assemblyRequired",
  });

  return (
    <Switch
      checked={(assemblyRequired as boolean) ?? false}
      onCheckedChange={(checked: boolean) => editAssembly(checked)}
    />
  );
}

interface ProductSlugProjection {
  slug: {
    current: string;
  } | null;
}

function ProductStoreLink(handle: DocumentHandle) {
  const { data } = useDocumentProjection<ProductSlugProjection>({
    ...handle,
    projection: `{ slug }`,
  });

  const slug = data?.slug?.current;

  if (!slug) return null;

  return (
    <Link
      href={`/products/${slug}`}
      target="_blank"
      className="flex items-center justify-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      View on store
      <ExternalLink className="h-3.5 w-3.5" />
    </Link>
  );
}

function ProductDetailContent({ handle }: { handle: DocumentHandle }) {
  const { data: name } = useDocument({ ...handle, path: "name" });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {(name as string) || "New Product"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Edit product details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DeleteButton handle={handle} />
          <Suspense fallback={null}>
            <RevertButton {...handle} />
          </Suspense>
          <Suspense fallback={null}>
            <PublishButton {...handle} />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border p-4 sm:p-6">
            <h2 className="mb-4 font-semibold">Basic Information</h2>
            <div className="space-y-4">
              <Label>Name</Label>
              <NameEditor {...handle} />
              <Label>Slug</Label>
              <SlugEditor {...handle} />
              <Label>Description</Label>
              <DescriptionEditor {...handle} />
            </div>
          </div>

          <div className="rounded-xl border p-4 sm:p-6">
            <h2 className="mb-4 font-semibold">Pricing & Inventory</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Price (A$)</Label>
                <PriceEditor {...handle} />
              </div>
              <div>
                <Label>Stock</Label>
                <StockEditor {...handle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const handle: DocumentHandle = {
    documentId: id,
    documentType: "product",
  };

  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <ProductDetailContent handle={handle} />
    </Suspense>
  );
}
