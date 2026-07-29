import handleHorizontalSwipe from "./gestures";
import { waitFor, waitForElement } from "./dom";
import { hide, setHeight, setSize } from "./ui";

async function init() {
  await waitFor(() => Boolean(Spicetify?.Platform && Spicetify?.Player));
}

export default async function main(): Promise<void> {
  await init()

  const topBar = await waitForElement(".Root__globalNav")
  const mainView = await waitForElement(".Root__main-view")
  const nowPlayingBar = await waitForElement(".Root__now-playing-bar")
  const avatar = await waitForElement(".main-image-image")
  const avatarChild = await waitForElement(".main-image-image.main-avatar-image")

  hide(".main-globalNav-searchSection")
  setHeight(topBar, 30)
  setSize(avatar.parentElement as HTMLElement, 24)
  setSize(avatar, 24)
  setSize(avatarChild, 24)

  handleHorizontalSwipe(mainView, {
    left: () => Spicetify.Platform.History.goBack(),
    right: () => Spicetify.Platform.History.goForward(),
  });

  handleHorizontalSwipe(nowPlayingBar, {
    left: () => {
      Spicetify.Player.seek(0);
      Spicetify.Player.back();
    },
    right: () => Spicetify.Player.next(),
  }, 20);
}
