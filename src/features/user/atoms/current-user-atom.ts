import { atom, PrimitiveAtom } from "jotai";
import { ICurrentUser, IUser } from "@/features/user/types/user.types";
import { IWorkspace } from "@/features/workspace/types/workspace.types";

// 身份仅保存在内存中；刷新后必须重新向服务端验证，不能恢复旧账号资料。
export const currentUserAtom = atom(null) as PrimitiveAtom<ICurrentUser | null>;

export const userAtom = atom(
  (get) => {
    const currentUser = get(currentUserAtom);
    return currentUser?.user ?? null;
  },
  (get, set, newUser: IUser) => {
    const currentUser = get(currentUserAtom);
    if (currentUser) {
      set(currentUserAtom, {
        ...currentUser,
        user: newUser,
      });
    }
  },
);

export const workspaceAtom = atom(
  (get) => {
    const currentUser = get(currentUserAtom);
    return currentUser?.workspace ?? null;
  },
  (get, set, newWorkspace: IWorkspace) => {
    const currentUser = get(currentUserAtom);
    if (currentUser) {
      set(currentUserAtom, {
        ...currentUser,
        workspace: newWorkspace,
      });
    }
  },
);
