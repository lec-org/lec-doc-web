import { atom, PrimitiveAtom } from "jotai";
import { Editor } from "@tiptap/core";
import { PageEditMode } from "@/features/user/types/user.types.ts";

// strictNullChecks 关闭时显式保留可写 atom 类型，清理阶段需要写入 null。
export const pageEditorAtom = atom(null) as PrimitiveAtom<Editor | null>;

export const titleEditorAtom = atom(null) as PrimitiveAtom<Editor | null>;

export const readOnlyEditorAtom = atom(null) as PrimitiveAtom<Editor | null>;

export const yjsConnectionStatusAtom = atom<string>("");

export const yjsSyncedAtom = atom<boolean>(false);

export const showLinkMenuAtom = atom(false);

export type LightboxRequest = {
  src: string;
  type: "image" | "video";
} | null;

const initialLightboxRequest: LightboxRequest = null;
export const lightboxRequestAtom = atom(initialLightboxRequest);

// Current page's edit mode — initialized from the user's saved preference on
// first load, can be toggled locally without persisting to the server.
export const currentPageEditModeAtom = atom<PageEditMode>(PageEditMode.Edit);
