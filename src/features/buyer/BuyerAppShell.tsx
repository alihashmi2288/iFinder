import React, { useEffect } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Calendar, Flame, Heart, User } from 'lucide-react';
import { PhoneFrame } from '../../components/PhoneFrame';
import { useAppStore } from '../../store/AppContext';
import { ChatScreen } from './ChatScreen';
import { ConsentScreen } from './ConsentScreen';
import { ListingDetailScreen } from './ListingDetailScreen';
import { MatchesScreen } from './MatchesScreen';
import { ProfileScreen } from './ProfileScreen';
import { QuizScreen } from './QuizScreen';
import { SavedScreen } from './SavedScreen';
import { SplashScreen } from './SplashScreen';
import { ViewingScreen } from './ViewingScreen';
import { ViewingsTabScreen } from './ViewingsTabScreen';

export const BuyerAppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, skipAsSara } = useAppStore();

  // Optional ?autostart=1 jumps directly to Matches as Sara
  useEffect(() => {
    if (searchParams.get('autostart') === '1' && !state.quizCompleted) {
      skipAsSara();
      navigate('/app/matches', { replace: true });
    }
  }, [searchParams, state.quizCompleted, skipAsSara, navigate]);

  const path = location.pathname;
  const isSplash = path === '/app' || path === '/app/';
  const isConsent = path === '/app/consent';
  const isQuiz = path === '/app/quiz';
  const isFullDetailOrModal =
    path.startsWith('/app/listing/') ||
    path.startsWith('/app/viewing/') ||
    path.startsWith('/app/chat/');

  const showBottomTabs =
    state.quizCompleted &&
    !isSplash &&
    !isConsent &&
    !isQuiz &&
    !isFullDetailOrModal;

  const buyerViewingsCount = state.viewingRequests.filter(
    (vr) => vr.buyerName === 'Sara' || !vr.id.startsWith('vr-seed-')
  ).length;

  return (
    <PhoneFrame darkScreen={isSplash}>
      <div className="flex-1 min-h-0 flex flex-col">
        <Routes>
          <Route
            index
            element={
              <SplashScreen
                onContinue={() => {
                  if (state.quizCompleted) {
                    navigate('/app/matches');
                  } else if (state.consent.accepted) {
                    navigate('/app/quiz');
                  } else {
                    navigate('/app/consent');
                  }
                }}
                onSkipAsSara={() => {
                  skipAsSara();
                  navigate('/app/matches');
                }}
              />
            }
          />
          <Route
            path="consent"
            element={
              <ConsentScreen onAccepted={() => navigate('/app/quiz')} />
            }
          />
          <Route
            path="quiz"
            element={
              <QuizScreen
                onBackToConsent={() => navigate('/app/consent')}
                onComplete={() => navigate('/app/matches')}
              />
            }
          />
          <Route path="matches" element={<MatchesScreen />} />
          <Route path="saved" element={<SavedScreen />} />
          <Route path="viewings" element={<ViewingsTabScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="listing/:id" element={<ListingDetailScreen />} />
          <Route path="viewing/:id" element={<ViewingScreen />} />
          <Route path="chat/:id" element={<ChatScreen />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </div>

      {showBottomTabs && (
        <nav
          aria-label="Buyer app navigation"
          className="h-16 bg-white border-t border-navy-900/10 grid grid-cols-4 items-center shrink-0"
        >
          <Link
            to="/app/matches"
            className={`h-full flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
              path.startsWith('/app/matches')
                ? 'text-navy-900'
                : 'text-muted-light hover:text-navy-900'
            }`}
          >
            <Flame
              className={`w-5 h-5 ${
                path.startsWith('/app/matches') ? 'text-gold-600' : ''
              }`}
              strokeWidth={1.75}
            />
            <span>Matches</span>
          </Link>

          <Link
            to="/app/saved"
            className={`h-full flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold relative transition-colors ${
              path.startsWith('/app/saved')
                ? 'text-navy-900'
                : 'text-muted-light hover:text-navy-900'
            }`}
          >
            <div className="relative">
              <Heart
                className={`w-5 h-5 ${
                  path.startsWith('/app/saved') ? 'text-gold-600' : ''
                }`}
                strokeWidth={1.75}
              />
              {state.savedIds.length > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 rounded-full bg-gold-500 text-navy-900 text-[10px] font-extrabold px-1 flex items-center justify-center tabular-nums">
                  {state.savedIds.length}
                </span>
              )}
            </div>
            <span>Saved</span>
          </Link>

          <Link
            to="/app/viewings"
            className={`h-full flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold relative transition-colors ${
              path.startsWith('/app/viewings')
                ? 'text-navy-900'
                : 'text-muted-light hover:text-navy-900'
            }`}
          >
            <div className="relative">
              <Calendar
                className={`w-5 h-5 ${
                  path.startsWith('/app/viewings') ? 'text-gold-600' : ''
                }`}
                strokeWidth={1.75}
              />
              {buyerViewingsCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 rounded-full bg-navy-900 text-paper text-[10px] font-bold px-1 flex items-center justify-center tabular-nums">
                  {buyerViewingsCount}
                </span>
              )}
            </div>
            <span>Viewings</span>
          </Link>

          <Link
            to="/app/profile"
            className={`h-full flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
              path.startsWith('/app/profile')
                ? 'text-navy-900'
                : 'text-muted-light hover:text-navy-900'
            }`}
          >
            <User
              className={`w-5 h-5 ${
                path.startsWith('/app/profile') ? 'text-gold-600' : ''
              }`}
              strokeWidth={1.75}
            />
            <span>Profile</span>
          </Link>
        </nav>
      )}
    </PhoneFrame>
  );
};
