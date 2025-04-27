module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};
