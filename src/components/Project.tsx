import { ID } from "jazz-tools";
import { Project, Issue } from "../schema";
import { IssueComponent } from "./Issue.tsx";
import { useCoState } from "jazz-react";
import { useState } from "react";

export function ProjectComponent({ projectID }: { projectID: ID<Project> }) {
    const project = useCoState(Project, projectID, {
        resolve: {
            issues: true
        }
    });

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;

    const createAndAddIssue = () => {
        project?.issues?.push(Issue.create({
            title: "",
            description: "",
            estimate: 0,
            status: "backlog",
        }, project._owner));
    };

    if (!project) {
        return <div>Loading project...</div>;
    }

    const totalIssues = project.issues.length;
    const totalPages = Math.ceil(totalIssues / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedIssues = project.issues.slice(startIndex, startIndex + pageSize);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">
                {project.name} – {totalIssues} Items
            </h1>

            <div className="border-r border-b p-4 space-y-2">
                {paginatedIssues.map((issue, index) => (
                    issue && <IssueComponent key={issue.id} issue={issue} index={startIndex + index} />
                ))}

                <button
                    onClick={createAndAddIssue}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create Issue
                </button>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded border ${page === currentPage
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-white hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
