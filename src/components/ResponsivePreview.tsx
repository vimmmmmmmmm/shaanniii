import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Maximize,
  Minimize,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ResponsivePreviewProps {
  htmlContent: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

type DeviceType = "mobile" | "tablet" | "desktop" | "custom";

interface DeviceConfig {
  width: number;
  height: number;
  name: string;
  icon: React.ReactNode;
}

const deviceConfigs: Record<DeviceType, DeviceConfig> = {
  mobile: {
    width: 375,
    height: 667,
    name: "Mobile",
    icon: <Smartphone className="h-4 w-4" />,
  },
  tablet: {
    width: 768,
    height: 1024,
    name: "Tablet",
    icon: <Tablet className="h-4 w-4" />,
  },
  desktop: {
    width: 1280,
    height: 800,
    name: "Desktop",
    icon: <Monitor className="h-4 w-4" />,
  },
  custom: {
    width: 1024,
    height: 768,
    name: "Custom",
    icon: <Maximize className="h-4 w-4" />,
  },
};

const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  htmlContent,
  isFullscreen = false,
  onToggleFullscreen = () => {},
}) => {
  const [currentDevice, setCurrentDevice] = useState<DeviceType>("desktop");
  const [isRotated, setIsRotated] = useState(false);
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(768);
  const [scale, setScale] = useState(1);

  const handleDeviceChange = (device: DeviceType) => {
    setCurrentDevice(device);
    setIsRotated(false);
    if (device === "custom") {
      setCustomWidth(1024);
      setCustomHeight(768);
    }
  };

  const handleRotate = () => {
    setIsRotated(!isRotated);
  };

  const getDeviceDimensions = () => {
    if (currentDevice === "custom") {
      return isRotated
        ? { width: customHeight, height: customWidth }
        : { width: customWidth, height: customHeight };
    }

    const config = deviceConfigs[currentDevice];
    return isRotated
      ? { width: config.height, height: config.width }
      : { width: config.width, height: config.height };
  };

  const dimensions = getDeviceDimensions();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="flex items-center justify-between p-2 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            {Object.entries(deviceConfigs).map(([key, config]) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentDevice === key ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDeviceChange(key as DeviceType)}
                  >
                    {config.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{config.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleRotate}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rotate Device</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {currentDevice === "custom" && (
            <div className="flex items-center space-x-2 ml-4">
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                className="w-16 h-8 bg-gray-800 border border-gray-700 rounded text-sm px-2"
                min="320"
                max="2560"
              />
              <span>×</span>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                className="w-16 h-8 bg-gray-800 border border-gray-700 rounded text-sm px-2"
                min="320"
                max="2560"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setScale(Math.max(0.25, scale - 0.25))}
              className="text-gray-400 hover:text-white"
              disabled={scale <= 0.25}
            >
              <Minimize className="h-4 w-4" />
            </button>
            <span className="text-xs w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(Math.min(2, scale + 0.25))}
              className="text-gray-400 hover:text-white"
              disabled={scale >= 2}
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={onToggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-grow overflow-auto flex items-center justify-center p-4 bg-gray-950">
        <div
          className="bg-white rounded-md overflow-hidden transition-all duration-300 shadow-lg"
          style={{
            width: dimensions.width * scale,
            height: dimensions.height * scale,
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          <iframe
            srcDoc={htmlContent}
            title="Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
          />
        </div>
      </div>

      <div className="p-2 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
        <div>
          {currentDevice !== "custom" ? (
            <span>
              {deviceConfigs[currentDevice].name} - {dimensions.width} ×{" "}
              {dimensions.height}
              {isRotated ? " (Rotated)" : ""}
            </span>
          ) : (
            <span>
              Custom - {dimensions.width} × {dimensions.height}
              {isRotated ? " (Rotated)" : ""}
            </span>
          )}
        </div>
        <div>
          <span>Scale: {Math.round(scale * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ResponsivePreview;
