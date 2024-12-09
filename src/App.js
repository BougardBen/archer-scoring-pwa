import { useState } from "react";

const saveState = (newState) => {
  window.localStorage.setItem("archersData", JSON.stringify(newState));
  console.log("%c State Saved:", "background: #222; color: #bada55", newState);
};
const ArcherScringApp = () => {
  console.log("Testing storage:", {
    write: (() => {
      try {
        window.localStorage.setItem("test", "test");
        const result = window.localStorage.getItem("test");
        return `Write: Success, Read back: ${result}`;
      } catch (e) {
        return `Error: ${e.message}`;
      }
    })(),
  });
};
  // État pour stocker les archers avec une structure de score plus détaillée
  const [archers, setArchers] = useState(() => {
    const savedData = window.localStorage.getItem("archersData");
    console.log(
      "%c Loading Data:",
      "background: #222; color: #bada55",
      savedData
    );
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [
      {
        id: 1,
        name: "Archer 1",
        totalScore: 0,
        targets: Array(21)
          .fill()
          .map(() => ({
            points: [],
            subtotal: 0,
          })),
      },
      {
        id: 2,
        name: "Archer 2",
        totalScore: 0,
        targets: Array(21)
          .fill()
          .map(() => ({
            points: [],
            subtotal: 0,
          })),
      },
      // Répéter pour les 10 archers...
      ...Array(8)
        .fill()
        .map((_, index) => ({
          id: index + 3,
          name: `Archer ${index + 3}`,
          totalScore: 0,
          targets: Array(21)
            .fill()
            .map(() => ({
              points: [],
              subtotal: 0,
            })),
        })),
    ];
  });

  // États pour la navigation et la sélection
  const [currentScreen, setCurrentScreen] = useState("main");
  const [selectedArcher, setSelectedArcher] = useState(null);
  const [editingArcherId, setEditingArcherId] = useState(null);
  // Fonctions de réinitialisation
  const resetAllScores = () => {
    const newState = archers.map((archer) => ({
      ...archer,
      totalScore: 0,
      targets: Array(21)
        .fill()
        .map(() => ({
          points: [],
          subtotal: 0,
        })),
    }));
    setArchers(newState);
    saveState(newState);
  };

  const resetScores = () => {
    const newState = archers.map((archer) => ({
      ...archer,
      totalScore: 0,
      targets: archer.targets.map((target) => ({
        ...target,
        points: [],
        subtotal: 0,
      })),
    }));
    setArchers(newState);
    saveState(newState);
  };

  const updateArcherName = (id, newName) => {
    const newState = archers.map((archer) =>
      archer.id === id ? { ...archer, name: newName } : archer
    );
    setArchers(newState);
    saveState(newState);
    setEditingArcherId(null);
  };

  // Composant pour l'écran de scoring d'un archer
  const ArcherScoringScreen = () => {
    const [localArcher, setLocalArcher] = useState({ ...selectedArcher });

    const addPointToTarget = (targetIndex, point) => {
      if (localArcher.targets[targetIndex].points.length >= 2) {
        return;
      }

      const updatedTargets = [...localArcher.targets];
      updatedTargets[targetIndex].points.push(point);

      updatedTargets[targetIndex].subtotal = updatedTargets[
        targetIndex
      ].points.reduce((a, b) => a + b, 0);

      const newTotalScore = updatedTargets.reduce(
        (total, target) => total + target.subtotal,
        0
      );

      const updatedArcher = {
        ...localArcher,
        targets: updatedTargets,
        totalScore: newTotalScore,
      };
      setLocalArcher(updatedArcher);

      const newArchersState = archers.map((a) =>
        a.id === selectedArcher.id ? updatedArcher : a
      );
      setArchers(newArchersState);
      saveState(newArchersState);
    };

    const removeLastPoint = (targetIndex) => {
      const updatedTargets = [...localArcher.targets];
      if (updatedTargets[targetIndex].points.length > 0) {
        updatedTargets[targetIndex].points.pop();

        updatedTargets[targetIndex].subtotal = updatedTargets[
          targetIndex
        ].points.reduce((a, b) => a + b, 0);

        const newTotalScore = updatedTargets.reduce(
          (total, target) => total + target.subtotal,
          0
        );

        const updatedArcher = {
          ...localArcher,
          targets: updatedTargets,
          totalScore: newTotalScore,
        };
        setLocalArcher(updatedArcher);

        const newArchersState = archers.map((a) =>
          a.id === selectedArcher.id ? updatedArcher : a
        );
        setArchers(newArchersState);
        saveState(newArchersState);
      }
    };

    return (
      <div className="p-4 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <button
            className="bg-gray-500 text-white px-3 py-2 rounded"
            onClick={() => {
              setCurrentScreen("main");
              saveState(archers);
            }}
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold">{localArcher.name} - Scoring</h1>
        </div>

        <div className="bg-white p-4 rounded-lg mb-4">
          <h2 className="text-xl text-center font-semibold">
            Score Total: {localArcher.totalScore}
          </h2>
        </div>

        <div className="space-y-2">
          {localArcher.targets.map((target, targetIndex) => (
            <div
              key={targetIndex}
              className="bg-white p-3 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Cible {targetIndex + 1}</span>
                <span className="font-bold">Sous-total: {target.subtotal}</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex space-x-2 flex-grow">
                  {[20, 15, 10, 0].map((points) => (
                    <button
                      key={points}
                      className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => addPointToTarget(targetIndex, points)}
                    >
                      {points}
                    </button>
                  ))}
                </div>

                <button
                  className="bg-red-500 text-white px-3 py-2 rounded"
                  onClick={() => removeLastPoint(targetIndex)}
                >
                  Annuler
                </button>
              </div>

              {target.points.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {target.points.map((point, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 px-2 py-1 rounded text-sm"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  const MainScreen = () => (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">
        Scores des Archers
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archers.map((archer) => (
          <div key={archer.id} className="bg-white p-4 rounded-lg shadow-md">
            {editingArcherId === archer.id ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  defaultValue={archer.name}
                  className="flex-grow border p-2 rounded"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateArcherName(archer.id, e.target.value);
                    } else if (e.key === "Escape") {
                      setEditingArcherId(null);
                      saveState(archers);
                    }
                  }}
                  onBlur={(e) => updateArcherName(archer.id, e.target.value)}
                  autoFocus
                />
              </div>
            ) : (
              <div
                className="cursor-pointer hover:bg-gray-50 transition"
                onClick={() => {
                  const newState = { ...archer };
                  setSelectedArcher(newState);
                  setCurrentScreen("scoring");
                  saveState(archers);
                }}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{archer.name}</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingArcherId(archer.id);
                      saveState(archers);
                    }}
                  >
                    ✏️
                  </button>
                </div>
                <p className="text-gray-600">
                  Score Total: {archer.totalScore}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          onClick={resetAllScores}
        >
          Reset All
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          onClick={resetScores}
        >
          Reset Scores
        </button>
      </div>
    </div>
  );

  return (
    <>
      {currentScreen === "main" && <MainScreen />}
      {currentScreen === "scoring" && <ArcherScoringScreen />}
    </>
  );
};

export default ArcherScoringApp;
