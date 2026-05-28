import { useState, useEffect } from "react";
import { useTheme } from "../../lib/theme";

export default function InstallPrompt() {
  const { t } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [platform, setPlatform] = useState("other"); // 'ios', 'android', 'other'

  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    if (isStandalone) return;

    // 2. Check if previously dismissed
    const isDismissed = localStorage.getItem("pwa-install-dismissed") === "true";
    if (isDismissed) return;

    // 3. Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isiOS) {
      setPlatform("ios");
    } else if (isAndroid) {
      setPlatform("android");
    }

    // 4. Listen for beforeinstallprompt (Chrome/Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform("android"); // Usually triggered on Chrome/Android
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. Wait 3 seconds before showing
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsDismissing(true);
    localStorage.setItem("pwa-install-dismissed", "true");
    setTimeout(() => {
      setIsVisible(false);
    }, 400); // Wait for animation
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  const renderContent = () => {
    if (platform === "android" && deferredPrompt) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "var(--type-body)", fontWeight: 600, marginBottom: "4px" }}>
              🏀 Add Morning Hoops
            </div>
            <div style={{ fontSize: "var(--type-body-sm)", color: t.t2 }}>
              Add to home screen for the full experience
            </div>
          </div>
          <button
            onClick={handleInstall}
            style={{
              background: t.accent,
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: "var(--type-label)",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            Install
          </button>
        </div>
      );
    }

    if (platform === "ios") {
      return (
        <div>
          <div style={{ fontSize: "var(--type-body)", fontWeight: 600, marginBottom: "4px" }}>
            🏀 Add to Home Screen
          </div>
          <div style={{ fontSize: "var(--type-body-sm)", color: t.t2 }}>
            Tap the share button <span style={{ fontSize: "1.1em" }}>↗</span> then "Add to Home Screen"
          </div>
        </div>
      );
    }

    return (
      <div>
        <div style={{ fontSize: "var(--type-body)", fontWeight: 600, marginBottom: "4px" }}>
          🏀 Install Morning Hoops
        </div>
        <div style={{ fontSize: "var(--type-body-sm)", color: t.t2 }}>
          Use your browser's install option to add this app
        </div>
      </div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInUp {
          from { transform: translate3d(0, 100%, 0); opacity: 0; }
          to { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes slideOutDown {
          from { transform: translate3d(0, 0, 0); opacity: 1; }
          to { transform: translate3d(0, 100%, 0); opacity: 0; }
        }
        .install-prompt-banner {
          animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .install-prompt-banner.dismissing {
          animation: slideOutDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
      <div
        className={`install-prompt-banner ${isDismissing ? "dismissing" : ""}`}
        style={{
          position: "fixed",
          bottom: "calc(var(--nav-height) + 12px)",
          left: "var(--space-page-x)",
          right: "var(--space-page-x)",
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          zIndex: 1000,
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: "14px",
          padding: "var(--space-card-pad)",
          fontFamily: "'Outfit', sans-serif",
          color: t.text,
          userSelect: "none"
        }}
      >
        <button
          onClick={handleDismiss}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "none",
            border: "none",
            color: t.t3,
            fontSize: "18px",
            cursor: "pointer",
            padding: "4px",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
        {renderContent()}
      </div>
    </>
  );
}
