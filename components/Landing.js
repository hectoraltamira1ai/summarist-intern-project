import { useDispatch } from "react-redux";
import { openSignInModal } from "@/redux/modalReducer";
import SignInModal from "./modals/SignInModal";

export default function Landing() {
  const dispatch = useDispatch();

  return (
    <section id="landing">
      <div className="container mx-auto">
        <div className="row">
          <div className="landing__wrapper">
            <div className="landing__content">
              <div className="landing__content__title">
                Gain more knowledge <br className="remove--tablet" />
                in less time
              </div>
              <div className="landing__content__subtitle">
                Great summaries for busy people,
                <br className="remove--tablet" />
                individuals who barely have time to read,
                <br className="remove--tablet" />
                and even people who don’t like to read.
              </div>
              <button
                className="btn home__cta--btn"
                onClick={() => dispatch(openSignInModal())}
              >
                Login
              </button>
              <SignInModal />
            </div>
            <figure className="landing__image--mask">
              <img src={"/assets/landing.png"} alt="landing" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
