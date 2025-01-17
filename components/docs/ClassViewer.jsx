import Title from "./Title";
import { faCode, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ParamsTable from "./ParamsTable";
import TypeLink from "./TypeLink";
import ParamsParser from "./ParamsParser";
import Special from "./Special";
import { GITHUB_LINK, BRANCH } from "../../config";

const constructLink = (path, file, line) => `${GITHUB_LINK}/blob/${BRANCH}/${path}/${file}#L${line}`;

export default function ClassViewer({ data }) {
    const Props = [
        {
            name: "Properties",
            data: data.data.props
        },
        {
            name: "Methods",
            data: data.data.methods
        },
        {
            name: "Events",
            data: data.data.events
        }
    ];

    const hasProps = Props.filter((x) => !x).length !== Props.length;

    return (
        <section>
            <div>
                <Title title={`new ${data.data.construct?.name ?? data.data.name}(${data.data.construct?.params?.map((m) => `${m.name}${m.optional ? "?" : ""}`).join(", ") || ""})`} source={constructLink(data.data.meta.path, data.data.meta.file, data.data.meta.line)} />
                {data.data.description ? (
                    <ParamsParser
                        className="text-white mt-0"
                        paramData={data.data.construct?.description ?? data.data.description}
                    />
                ) : null}
            </div>
            <div>
                {data.data.construct?.params?.length ? (
                    <div className="py-5">
                        <ParamsTable paramsData={data.data.construct?.params} />
                    </div>
                ) : null}
                {hasProps ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-10">
                        {Props.filter((x) => !!x.data).map((m) => {
                            const propid = `props-${m.name}`;
                            return (
                                <div>
                                    <div className="flex flex-row justify-between items-center text-gray-200 cursor-pointer lg:cursor-default" onClick={() => document.getElementById(propid).classList.toggle("hidden")}>
                                        <p className="font-semibold">{m.name}</p>
                                        <FontAwesomeIcon className="h-5 w-5 lg:hidden" icon={faAngleDown} />
                                    </div>
                                    <div className="hidden lg:flex lg:flex-col" id={propid}>
                                        {m.data
                                            .sort(
                                                (a, b) =>
                                                    a.name.toLowerCase().charCodeAt() -
                                                    b.name.toLowerCase().charCodeAt()
                                            )
                                            .map((m) => {
                                                return (
                                                    <div className="prop">
                                                        <span className="title text-gray-200 hover:text-gray-100 border-l-2 border-gray-400 hover:border-blue-500">
                                                            <a
                                                                className="cursor-pointer px-2"
                                                                href={`#${data.data.name.replace(
                                                                    / +/g,
                                                                    "-"
                                                                )}-${m.name.replace(/ +/g, "-")}`}
                                                            >
                                                                {m.name}
                                                            </a>
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : null}

                <div className="viewer">
                    {hasProps
                        ? Props.filter((x) => !!x.data).map((m) => {
                              return (
                                  <div>
                                      <h1 className="title font-semibold text-gray-200 text-3xl">{m.name}</h1>
                                      <div className="flex flex-col py-3">
                                          {m.data
                                              .sort(
                                                  (a, b) =>
                                                      a.name.toLowerCase().charCodeAt() -
                                                      b.name.toLowerCase().charCodeAt()
                                              )
                                              .map((n) => {
                                                  return (
                                                      <div className="prop py-3 text-gray-200">
                                                          <h1
                                                              id={`${data.data.name.replace(
                                                                  / +/g,
                                                                  "-"
                                                              )}-${n.name.replace(/ +/g, "-")}`}
                                                              className="cursor-pointer text-xl hover:text-blue-500"
                                                          >
                                                              <a
                                                                  href={`#${data.data.name.replace(
                                                                      / +/g,
                                                                      "-"
                                                                  )}-${n.name.replace(/ +/g, "-")}`}
                                                              >
                                                                  {`${m.name === "Events" ? "" : "."}${n.name}${
                                                                      m.name === "Methods"
                                                                          ? `(${
                                                                                n.params
                                                                                    ?.map(
                                                                                        (m) =>
                                                                                            `${m.name}${
                                                                                                m.optional ? "?" : ""
                                                                                            }`
                                                                                    )
                                                                                    .join(", ") || ""
                                                                            })`
                                                                          : ""
                                                                  }`}
                                                                  {<Special prop={n} />}
                                                              </a>
                                                              <a
                                                                  className="float-right"
                                                                  href={constructLink(
                                                                      n.meta.path,
                                                                      n.meta.file,
                                                                      n.meta.line
                                                                  )}
                                                              >
                                                                  <FontAwesomeIcon
                                                                      icon={faCode}
                                                                      className="h-7 w-7 text-blue-500 hover:text-blue-600 cursor-pointer"
                                                                  />
                                                              </a>
                                                          </h1>
                                                          {/* <Title title={} source={} /> */}
                                                          <ParamsTable
                                                              paramsData={n.params || []}
                                                              description={n.description}
                                                              withBorder="true"
                                                          />
                                                          {n.type?.length ? (
                                                              <h1 className="text-xl text-gray-200">
                                                                  Type: <TypeLink type={n.type} />
                                                              </h1>
                                                          ) : null}
                                                          {n.returns?.length ? (
                                                              <h1 className="text-xl text-gray-200 mt-2">
                                                                  Returns: <TypeLink type={n.returns} />
                                                              </h1>
                                                          ) : null}
                                                      </div>
                                                  );
                                              })}
                                      </div>
                                  </div>
                              );
                          })
                        : null}
                </div>
            </div>
        </section>
    );
}
