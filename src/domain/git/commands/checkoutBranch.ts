import * as git from "isomorphic-git"
import fs from "fs"
export async function checkoutBranch(
  projectRoot: string,
  branchName: string
): Promise<void> {
  return git.checkout({ fs, dir: projectRoot, ref: branchName })
}
